import { Injectable, BadRequestException } from '@nestjs/common';
import * as tls from 'tls';
import * as https from 'https';
import { URL } from 'url';

@Injectable()
export class SslService {
  
  async checkCertificate(domain: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // Handle cleaning domain input (remove https://, trailing slashes)
      let cleanDomain = domain;
      try {
          if (domain.startsWith('http')) {
              const url = new URL(domain);
              cleanDomain = url.hostname;
          }
      } catch (e) {
          // If URL parsing fails, assume it's already a hostname
          cleanDomain = domain;
      }
      
      const options = {
        host: cleanDomain,
        port: 443,
        rejectUnauthorized: false, // We want to get info even if self-signed/expired
        servername: cleanDomain // SNI
      };

      const socket = tls.connect(options, () => {
        const cert = socket.getPeerCertificate(true); // true to get full chain if needed
        socket.end();

        if (!cert || Object.keys(cert).length === 0) {
            return reject(new BadRequestException('No certificate found for this domain'));
        }

        const validFrom = new Date(cert.valid_from);
        const validTo = new Date(cert.valid_to);
        const daysRemaining = Math.ceil((validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

        resolve({
          domain: cleanDomain,
          issuer: cert.issuer.O || cert.issuer.CN,
          validFrom: validFrom.toISOString(),
          validTo: validTo.toISOString(),
          daysRemaining: daysRemaining,
          isValid: daysRemaining > 0, // Basic check, could encompass more
          fingerprint: cert.fingerprint
        });
      });

      socket.on('error', (err) => {
        reject(new BadRequestException(`SSL Check Failed: ${err.message}`));
      });

      socket.setTimeout(5000, () => {
          socket.destroy();
          reject(new BadRequestException('SSL Check Failed: Connection Timeout'));
      });
    });
  }
}
