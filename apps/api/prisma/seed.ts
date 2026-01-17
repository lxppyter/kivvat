import 'dotenv/config';
import { PrismaClient, ComplianceStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');
  
  console.log('Cleaning up deprecated standards...');
  const deprecatedControls = await prisma.control.findMany({
    where: { standard: { name: 'GDPR / KVKK' } }
  });
  if (deprecatedControls.length > 0) {
      await prisma.gapAnalysis.deleteMany({
          where: { controlId: { in: deprecatedControls.map(c => c.id) } }
      });
      await prisma.control.deleteMany({
          where: { id: { in: deprecatedControls.map(c => c.id) } }
      });
  }
  await prisma.complianceStandard.deleteMany({
    where: { name: 'GDPR / KVKK' },
  });

  // Helper to create standard with controls
  const createStandard = async (name: string, desc: string, controls: { code: string; name: string; desc: string }[]) => {
    const std = await prisma.complianceStandard.upsert({
      where: { name },
      update: {},
      create: { name, description: desc },
    });
    console.log(`Synced Standard: ${std.name}`);

    // FIX: Clear existing controls to prevent duplicates
    // Must delete child records (GapAnalysis) first due to FK constraints
    const existingControls = await prisma.control.findMany({
        where: { standardId: std.id }
    });
    
    if (existingControls.length > 0) {
        await prisma.gapAnalysis.deleteMany({
            where: { controlId: { in: existingControls.map(c => c.id) } }
        });
        await prisma.control.deleteMany({
            where: { id: { in: existingControls.map(c => c.id) } }
        });
    }

    for (const c of controls) {
      const control = await prisma.control.create({
        data: {
          standardId: std.id,
          code: c.code,
          name: c.name,
          description: c.desc,
        },
      });
      // Mock Evidence generation removed for Production
    }
  };

  // ... (ISO 27001, SOC 2, GDPR remain as is, we only update KVKK below)

  // 4. KVKK (Türkiye - Kapsamlı Teknik ve İdari Tedbirler)
  await createStandard('KVKK', 'Kişisel Verilerin Korunması Kanunu', [
    // İdari Tedbirler
    { code: 'IDARI.1', name: 'Kişisel Veri İşleme Envanteri', desc: 'Veri sorumluları tarafından kişisel veri işleme envanteri hazırlanmalıdır.' },
    { code: 'IDARI.2', name: 'Kurumsal Politikalar', desc: 'Kişisel veri saklama ve imha politikası hazırlanmalıdır.' },
    { code: 'IDARI.3', name: 'Aydınlatma Metinleri', desc: 'İlgili kişiler için aydınlatma metinleri oluşturulmalı ve duyurulmalıdır.' },
    { code: 'IDARI.4', name: 'Açık Rıza Alınması', desc: 'Gereken durumlarda ilgili kişilerden açık rıza alınmalıdır.' },
    { code: 'IDARI.5', name: 'Veri Sorumlusu Başvuru Süreçleri', desc: 'İlgili kişi başvurularını yönetmek için prosedürler oluşturulmalıdır.' },
    { code: 'IDARI.6', name: 'Taahhütnameler', desc: 'Çalışanlar ve veri işleyenler ile gizlilik taahhütnameleri imzalanmalıdır.' },
    { code: 'IDARI.7', name: 'VERBİS Kaydı', desc: 'Kayıt yükümlülüğü varsa VERBİS kaydı yapılmalı ve güncel tutulmalıdır.' },
    { code: 'IDARI.8', name: 'Risk Analizleri', desc: 'Kişisel veri güvenliğine ilişkin risk analizleri yapılmalıdır.' },
    { code: 'IDARI.9', name: 'Eğitim ve Farkındalık', desc: 'Çalışanlara periyodik olarak KVKK farkındalık eğitimi verilmelidir.' },
    { code: 'IDARI.10', name: 'Sözleşme Yönetimi', desc: 'Tedarikçi sözleşmelerine KVKK maddeleri eklenmelidir.' },
    
    // Teknik Tedbirler - Yetki ve Erişim
    { code: 'TEKNIK.1', name: 'Yetki Matrisi', desc: 'Çalışanların yetkileri belirlenmeli ve yetki matrisi oluşturulmalıdır.' },
    { code: 'TEKNIK.2', name: 'Erişim Logları', desc: 'Sistem erişim logları imzalı ve güvenli şekilde tutulmalıdır.' },
    { code: 'TEKNIK.3', name: 'Kullanıcı Hesap Yönetimi', desc: 'Kullanıcı hesapları ve yetkileri düzenli olarak gözden geçirilmelidir.' },
    { code: 'TEKNIK.4', name: 'Şifre Politikası', desc: 'Güçlü şifre politikaları (uzunluk, karmaşıklık) uygulanmalıdır.' },
    
    // Teknik Tedbirler - Siber Güvenlik
    { code: 'TEKNIK.5', name: 'Ağ Güvenliği', desc: 'Güvenlik duvarı (Firewall) ve ağ güvenlik cihazları kullanılmalıdır.' },
    { code: 'TEKNIK.6', name: 'Antivirüs ve Anti-Malware', desc: 'Tüm cihazlarda güncel antivirüs yazılımları bulunmalıdır.' },
    { code: 'TEKNIK.7', name: 'Yama Yönetimi', desc: 'Yazılım ve işletim sistemi güncellemeleri düzenli yapılmalıdır.' },
    { code: 'TEKNIK.8', name: 'Veri Kaybı Önleme (DLP)', desc: 'Veri sızıntılarını önlemek için DLP yazılımları kullanılmalıdır.' },
    { code: 'TEKNIK.9', name: 'Sızma Testleri', desc: 'Periyodik olarak sızma testleri (Penetration Test) yapılmalıdır.' },
    
    // Teknik Tedbirler - Yedekleme ve Şifreleme
    { code: 'TEKNIK.10', name: 'Yedekleme Güvenliği', desc: 'Veriler düzenli yedeklenmeli ve yedeklerin güvenliği sağlanmalıdır.' },
    { code: 'TEKNIK.11', name: 'Kriptografik Şifreleme', desc: 'Özel nitelikli veriler ve taşınabilir medyadaki veriler şifrelenmelidir.' },
    { code: 'TEKNIK.12', name: 'Anahtar Yönetimi', desc: 'Şifreleme anahtarları güvenli bir ortamda saklanmalıdır.' },
    
    // Teknik Tedbirler - İzleme
    { code: 'TEKNIK.13', name: 'Saldırı Tespit Sistemleri', desc: 'IDS/IPS sistemleri ile ağ trafiği izlenmelidir.' },
    { code: 'TEKNIK.14', name: 'Veri Maskeleme', desc: 'Gerektiğinde geliştirme ortamlarında veri maskeleme uygulanmalıdır.' },
    
    // Özel Nitelikli Veriler
    { code: 'ONV.1', name: 'Özel Nitelikli Veri Güvenliği', desc: 'Özel nitelikli veriler için Kurul tarafından belirlenen ek önlemler alınmalıdır.' },
    { code: 'ONV.2', name: 'İki Kademeli Doğrulama (2FA)', desc: 'Özel nitelikli verilere erişimde 2FA kullanılmalıdır.' },
  ]);

  // 1. ISO 27001:2013 (Full Annex A - 114 Controls)
  // ... (Keeping ISO 27001 list as is, it was correct in previous step) ...
  await createStandard('ISO 27001:2013', 'Bilgi Güvenliği Yönetim Sistemi', [
    // A.5 Information Security Policies
    { code: 'A.5.1.1', name: 'Information security policies', desc: 'Policies for information security are defined and approved.' },
    { code: 'A.5.1.2', name: 'Review of the policies', desc: 'The policies are reviewed at planned intervals.' },
    // A.6 Organization of Information Security
    { code: 'A.6.1.1', name: 'Information security roles and responsibilities', desc: 'Responsibilities are defined and allocated.' },
    { code: 'A.6.1.2', name: 'Segregation of duties', desc: 'Conflicting duties used to reduce the risk of unauthorized modification.' },
    { code: 'A.6.1.3', name: 'Contact with authorities', desc: 'Appropriate contacts with relevant authorities are maintained.' },
    { code: 'A.6.1.4', name: 'Contact with special interest groups', desc: 'Contacts with special interest groups are maintained.' },
    { code: 'A.6.1.5', name: 'Information security in project management', desc: 'InfoSec addressed in project management.' },
    { code: 'A.6.2.1', name: 'Mobile device policy', desc: 'Policy for mobile devices adopted.' },
    { code: 'A.6.2.2', name: 'Teleworking', desc: 'Policy for teleworking adopted.' },
    // A.7 Human Resource Security
    { code: 'A.7.1.1', name: 'Screening', desc: 'Background verification checks on all candidates.' },
    { code: 'A.7.1.2', name: 'Terms and conditions of employment', desc: 'Contractual agreements state responsibilities.' },
    { code: 'A.7.2.1', name: 'Management responsibilities', desc: 'Management requires employees to apply security.' },
    { code: 'A.7.2.2', name: 'Information security awareness, education and training', desc: 'Employees receive appropriate training.' },
    { code: 'A.7.2.3', name: 'Disciplinary process', desc: 'Formal disciplinary process for security breaches.' },
    { code: 'A.7.3.1', name: 'Termination or change of employment responsibilities', desc: 'Responsibilities remain valid after termination.' },
    // A.8 Asset Management
    { code: 'A.8.1.1', name: 'Inventory of assets', desc: 'Assets associated with information identified and inventoried.' },
    { code: 'A.8.1.2', name: 'Ownership of assets', desc: 'Assets maintained in the inventory owned.' },
    { code: 'A.8.1.3', name: 'Acceptable use of assets', desc: 'Rules for acceptable use of assets identified.' },
    { code: 'A.8.1.4', name: 'Return of assets', desc: 'All assets returned upon termination.' },
    { code: 'A.8.2.1', name: 'Classification of information', desc: 'Information classified in terms of legal requirements etc.' },
    { code: 'A.8.2.2', name: 'Labeling of information', desc: 'Appropriate set of procedures for information labeling.' },
    { code: 'A.8.2.3', name: 'Handling of assets', desc: 'Procedures for handling assets adopted.' },
    { code: 'A.8.3.1', name: 'Management of removable media', desc: 'Procedures for management of removable media.' },
    { code: 'A.8.3.2', name: 'Disposal of media', desc: 'Media disposed of securely.' },
    { code: 'A.8.3.3', name: 'Physical media transfer', desc: 'Media containing information protected against unauthorized access.' },
    // A.9 Access Control
    { code: 'A.9.1.1', name: 'Access control policy', desc: 'Access control policy established.' },
    { code: 'A.9.1.2', name: 'Access to networks and network services', desc: 'Users only provided with access to services authorized to use.' },
    { code: 'A.9.2.1', name: 'User registration and de-registration', desc: 'Formal user registration process implemented.' },
    { code: 'A.9.2.2', name: 'User access provisioning', desc: 'Formal user access provisioning process.' },
    { code: 'A.9.2.3', name: 'Management of privileged access rights', desc: 'Allocation of privileged access rights restricted.' },
    { code: 'A.9.2.4', name: 'Management of secret authentication information of users', desc: 'Allocation of secret auth info controlled.' },
    { code: 'A.9.2.5', name: 'Review of user access rights', desc: 'Asset owners review users access rights.' },
    { code: 'A.9.2.6', name: 'Removal or adjustment of access rights', desc: 'Access rights removed upon termination.' },
    { code: 'A.9.3.1', name: 'Use of secret authentication information', desc: 'Users required to follow practices for secret auth info.' },
    { code: 'A.9.4.1', name: 'Information access restriction', desc: 'Access to info and application functions systems restricted.' },
    { code: 'A.9.4.2', name: 'Secure log-on procedures', desc: 'Access to systems controlled by secure log-on.' },
    { code: 'A.9.4.3', name: 'Password management system', desc: 'Password management system interactive.' },
    { code: 'A.9.4.4', name: 'Use of privileged utility programs', desc: 'Use of utility programs capable of overriding system restricted.' },
    { code: 'A.9.4.5', name: 'Access control to program source code', desc: 'Access to program source code restricted.' },
    // A.10 Cryptography
    { code: 'A.10.1.1', name: 'Policy on the use of cryptographic controls', desc: 'Policy on use of crypto controls developed.' },
    { code: 'A.10.1.2', name: 'Key management', desc: 'Policy on use and protection of crypto keys.' },
    // A.11 Physical and Environmental Security
    { code: 'A.11.1.1', name: 'Physical security perimeter', desc: 'Security perimeters defined and used.' },
    { code: 'A.11.1.2', name: 'Physical entry controls', desc: 'Secure areas protected by entry controls.' },
    { code: 'A.11.1.3', name: 'Securing offices, rooms and facilities', desc: 'Physical security for offices designed and applied.' },
    { code: 'A.11.1.4', name: 'Protecting against external and environmental threats', desc: 'Protection against natural disasters etc.' },
    { code: 'A.11.1.5', name: 'Working in secure areas', desc: 'Procedures for working in secure areas.' },
    { code: 'A.11.1.6', name: 'Delivery and loading areas', desc: 'Access to loading areas controlled.' },
    { code: 'A.11.2.1', name: 'Equipment siting and protection', desc: 'Equipment sited and protected to reduce risks.' },
    { code: 'A.11.2.2', name: 'Supporting utilities', desc: 'Equipment protected from power failures etc.' },
    { code: 'A.11.2.3', name: 'Cabling security', desc: 'Power and telecom cabling protected.' },
    { code: 'A.11.2.4', name: 'Equipment maintenance', desc: 'Equipment maintained correctly.' },
    { code: 'A.11.2.5', name: 'Removal of assets', desc: 'Equipment not taken off-site without authorization.' },
    { code: 'A.11.2.6', name: 'Security of equipment and assets off-premises', desc: 'Security applied to off-site assets.' },
    { code: 'A.11.2.7', name: 'Secure disposal or re-use of equipment', desc: 'Items containing storage media verified before disposal.' },
    { code: 'A.11.2.8', name: 'Unattended user equipment', desc: 'Unattended equipment has appropriate protection.' },
    { code: 'A.11.2.9', name: 'Clear desk and clear screen policy', desc: 'Clear desk and screen policy adopted.' },
    // A.12 Operations Security
    { code: 'A.12.1.1', name: 'Documented operating procedures', desc: 'Operating procedures documented.' },
    { code: 'A.12.1.2', name: 'Change management', desc: 'Changes to info processing facilities controlled.' },
    { code: 'A.12.1.3', name: 'Capacity management', desc: 'Use of resources monitored.' },
    { code: 'A.12.1.4', name: 'Separation of development, testing and operational environments', desc: 'Dev, test, and ops environments separated.' },
    { code: 'A.12.2.1', name: 'Controls against malware', desc: 'Detection controls against malware implemented.' },
    { code: 'A.12.3.1', name: 'Information backup', desc: 'Backup copies of info taken and tested.' },
    { code: 'A.12.4.1', name: 'Event logging', desc: 'Event logs recording user activities produced.' },
    { code: 'A.12.4.2', name: 'Protection of log information', desc: 'Logging facilities and log info protected.' },
    { code: 'A.12.4.3', name: 'Administrator and operator logs', desc: 'Admin logs reviewed regularly.' },
    { code: 'A.12.4.4', name: 'Clock synchronization', desc: 'Clocks of all info processing systems synchronized.' },
    { code: 'A.12.5.1', name: 'Installation of software on operational systems', desc: 'Procedures for software installation implemented.' },
    { code: 'A.12.6.1', name: 'Management of technical vulnerabilities', desc: ' info about technical vulnerabilities obtained.' },
    { code: 'A.12.6.2', name: 'Restrictions on software installation', desc: 'Rules for governing installation of software established.' },
    { code: 'A.12.7.1', name: 'Information systems audit controls', desc: 'Audit requirements dealing with operational systems minimized.' },
    // A.13 Communications Security
    { code: 'A.13.1.1', name: 'Network controls', desc: 'Networks managed and controlled.' },
    { code: 'A.13.1.2', name: 'Security of network services', desc: 'Security mechanisms of network services identified.' },
    { code: 'A.13.1.3', name: 'Segregation in networks', desc: 'Groups of info services segregated.' },
    { code: 'A.13.2.1', name: 'Information transfer policies and procedures', desc: 'Formal transfer policies in place.' },
    { code: 'A.13.2.2', name: 'Agreements on information transfer', desc: 'Agreements addressing secure transfer of info.' },
    { code: 'A.13.2.3', name: 'Electronic messaging', desc: 'Info involved in electronic messaging protected.' },
    { code: 'A.13.2.4', name: 'Confidentiality or non-disclosure agreements', desc: 'Requirements for confidentiality agreements identified.' },
    // A.14 System Acquisition, Development and Maintenance
    { code: 'A.14.1.1', name: 'Information security requirements analysis and specification', desc: 'Security requirements included in new systems.' },
    { code: 'A.14.1.2', name: 'Securing application services on public networks', desc: 'Info involved in app services protected.' },
    { code: 'A.14.1.3', name: 'Protecting application services transactions', desc: 'Info involved in app service transactions protected.' },
    { code: 'A.14.2.1', name: 'Secure development policy', desc: 'Rules for development of software established.' },
    { code: 'A.14.2.2', name: 'System change control procedures', desc: 'Changes to systems controlled.' },
    { code: 'A.14.2.3', name: 'Technical review of applications after operating platform changes', desc: 'Critical apps reviewed after platform changes.' },
    { code: 'A.14.2.4', name: 'Restrictions on changes to software packages', desc: 'Modifications to software packages discouraged.' },
    { code: 'A.14.2.5', name: 'Secure system engineering principles', desc: 'Principles for secure systems established.' },
    { code: 'A.14.2.6', name: 'Secure development environment', desc: 'Secure dev environment established.' },
    { code: 'A.14.2.7', name: 'Outsourced development', desc: 'Outsourced development monitored.' },
    { code: 'A.14.2.8', name: 'System security testing', desc: 'Testing of security functionality carried out.' },
    { code: 'A.14.2.9', name: 'System acceptance testing', desc: 'Acceptance testing programs established.' },
    { code: 'A.14.3.1', name: 'Protection of test data', desc: 'Test data selected carefully.' },
    // A.15 Supplier Relationships
    { code: 'A.15.1.1', name: 'Information security policy for supplier relationships', desc: 'Info sec requirements for suppliers.' },
    { code: 'A.15.1.2', name: 'Addressing security within supplier agreements', desc: 'Security controls agreed and documented.' },
    { code: 'A.15.1.3', name: 'Information and communication technology supply chain', desc: 'Agreements with suppliers include supply chain risks.' },
    { code: 'A.15.2.1', name: 'Monitoring and review of supplier services', desc: 'Supplier service delivery monitored.' },
    { code: 'A.15.2.2', name: 'Managing changes to supplier services', desc: 'Changes to provision of services managed.' },
    // A.16 Information Security Incident Management
    { code: 'A.16.1.1', name: 'Responsibilities and procedures', desc: 'Management responsibilities for incidents established.' },
    { code: 'A.16.1.2', name: 'Reporting information security events', desc: 'Info sec events reported.' },
    { code: 'A.16.1.3', name: 'Reporting information security weaknesses', desc: 'Info sec weaknesses reported.' },
    { code: 'A.16.1.4', name: 'Assessment of and decision on information security events', desc: 'Info sec events assessed.' },
    { code: 'A.16.1.5', name: 'Response to information security incidents', desc: 'Info sec incidents responded to.' },
    { code: 'A.16.1.6', name: 'Learning from information security incidents', desc: 'Knowledge gained from incidents used.' },
    { code: 'A.16.1.7', name: 'Collection of evidence', desc: 'Procedures for identification of evidence defined.' },
    // A.17 Information Security Aspects of Business Continuity Management
    { code: 'A.17.1.1', name: 'Planning information security continuity', desc: 'Info sec continuity requirements determined.' },
    { code: 'A.17.1.2', name: 'Implementing information security continuity', desc: 'Procedures implemented to ensure continuity.' },
    { code: 'A.17.1.3', name: 'Verify, review and evaluate information security continuity', desc: 'Info sec continuity controls verified.' },
    { code: 'A.17.2.1', name: 'Availability of information processing facilities', desc: 'Info processing facilities available.' },
    // A.18 Compliance
    { code: 'A.18.1.1', name: 'Identification of applicable legislation and contractual requirements', desc: 'Requirements identified.' },
    { code: 'A.18.1.2', name: 'Intellectual property rights', desc: 'Procedures to ensure compliance with IPR implemented.' },
    { code: 'A.18.1.3', name: 'Protection of records', desc: 'Records protected from loss.' },
    { code: 'A.18.1.4', name: 'Privacy and protection of personally identifiable information', desc: 'Privacy protected.' },
    { code: 'A.18.1.5', name: 'Regulation of cryptographic controls', desc: 'Crypto controls used in compliance with regulations.' },
    { code: 'A.18.2.1', name: 'Independent review of information security', desc: 'Info sec implementation reviewed systematically.' },
    { code: 'A.18.2.2', name: 'Compliance with security policies and standards', desc: 'Managers review compliance.' },
    { code: 'A.18.2.3', name: 'Technical compliance review', desc: 'Info systems reviewed for compliance.' },
  ]);

  // 2. SOC 2 Type II
  await createStandard('SOC 2 Type II', 'Service Organization Control', [
    // CC1 Control Environment
    { code: 'CC1.1', name: 'COSO Principle 1: Integrity and Ethical Values', desc: 'The entity demonstrates a commitment to integrity and ethical values.' },
    { code: 'CC1.2', name: 'COSO Principle 2: Oversight Responsibility', desc: 'The board of directors demonstrates independence from management and exercises oversight.' },
    { code: 'CC1.3', name: 'COSO Principle 3: Structure, Authority, and Responsibility', desc: 'Management establishes structures, reporting lines, and appropriate authorities.' },
    { code: 'CC1.4', name: 'COSO Principle 4: Competence', desc: 'The entity demonstrates a commitment to attract, develop, and retain competent individuals.' },
    { code: 'CC1.5', name: 'COSO Principle 5: Accountability', desc: 'The entity holds individuals accountable for their internal control responsibilities.' },
    
    // CC2 Communication and Information
    { code: 'CC2.1', name: 'COSO Principle 13: Quality Information', desc: 'The entity obtains or generates and uses relevant, quality information.' },
    { code: 'CC2.2', name: 'COSO Principle 14: Internal Communication', desc: 'The entity communicates information internally.' },
    { code: 'CC2.3', name: 'COSO Principle 15: External Communication', desc: 'The entity communicates with external parties.' },

    // CC3 Risk Assessment
    { code: 'CC3.1', name: 'COSO Principle 6: Specify Objectives', desc: 'The entity specifies objectives with sufficient clarity.' },
    { code: 'CC3.2', name: 'COSO Principle 7: Identify and Analyze Risks', desc: 'The entity identifies risks to the achievement of its objectives.' },
    { code: 'CC3.3', name: 'COSO Principle 8: Fraud Risk', desc: 'The entity considers the potential for fraud in assessing risks.' },
    { code: 'CC3.4', name: 'COSO Principle 9: Identify and Analyze Changes', desc: 'The entity identifies and assesses changes that could significantly impact the system.' },

    // CC4 Monitoring Activities
    { code: 'CC4.1', name: 'COSO Principle 16: Monitoring Activities', desc: 'The entity selects, develops, and performs ongoing and/or separate evaluations.' },
    { code: 'CC4.2', name: 'COSO Principle 17: Evaluate and Communicate Deficiencies', desc: 'The entity evaluates and communicates internal control deficiencies.' },

    // CC5 Control Activities
    { code: 'CC5.1', name: 'COSO Principle 10: Control Activities', desc: 'The entity selects and develops control activities.' },
    { code: 'CC5.2', name: 'COSO Principle 11: Technology Controls', desc: 'The entity selects and develops general control activities over technology.' },
    { code: 'CC5.3', name: 'COSO Principle 12: Policies and Procedures', desc: 'The entity deploys control activities through policies and procedures.' },

    // CC6 Logical and Physical Access Controls
    { code: 'CC6.1', name: 'Logical Access Security', desc: 'The entity restricts logical access to security software, data, and systems.' },
    { code: 'CC6.2', name: 'User Registration', desc: 'Prior to issuing system credentials, the entity registers and authorizes new internal and external users.' },
    { code: 'CC6.3', name: 'Access Rights', desc: 'The entity authorizes, modifies, or removes access to data, software, functions, and other protected information assets.' },
    { code: 'CC6.4', name: 'Physical Access', desc: 'The entity restricts physical access to facilities.' },
    { code: 'CC6.5', name: 'Disposal of Data and Equipment', desc: 'The entity provides for the recovery of information assets.' },
    { code: 'CC6.6', name: 'External Threats', desc: 'The entity implements boundary protection systems.' },
    { code: 'CC6.7', name: 'Transmission of Data', desc: 'The entity restricts the transmission of confidential information.' },
    { code: 'CC6.8', name: 'Malicious Software', desc: 'The entity detects and prevents the introduction of malicious software.' },

    // CC7 System Operations
    { code: 'CC7.1', name: 'Monitoring', desc: 'System operations are monitored and anomalies are assessed.' },
    { code: 'CC7.2', name: 'Incidents', desc: 'The entity identifies, reports, and responds to security incidents.' },
    { code: 'CC7.3', name: 'Problem Management', desc: 'The entity evaluates security events to determine if they are incidents.' },
    { code: 'CC7.4', name: 'Disaster Recovery', desc: 'The entity responds to incidents that significantly compromise operations.' },
    { code: 'CC7.5', name: 'Restore from Backup', desc: 'The entity restores data from backup.' },

    // CC8 Change Management
    { code: 'CC8.1', name: 'Change Management', desc: 'The entity authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes.' },

    // CC9 Risk Mitigation
    { code: 'CC9.1', name: 'Risk Mitigation', desc: 'The entity identifies, selects, and develops risk mitigation activities.' },
    { code: 'CC9.2', name: 'Vendor Management', desc: 'The entity assesses and manages risks associated with vendors.' },
  ]);

  // 3. GDPR (European Union)
  await createStandard('GDPR', 'General Data Protection Regulation', [
    { code: 'Art. 5(1)', name: 'Principles relating to processing of personal data', desc: 'Lawfulness, fairness and transparency; purpose limitation; data minimization.' },
    { code: 'Art. 6(1)', name: 'Lawfulness of processing', desc: 'Processing shall be lawful only if and to the extent that at least one legal basis applies.' },
    { code: 'Art. 7', name: 'Conditions for consent', desc: 'Where processing is based on consent, the controller shall be able to demonstrate that the data subject has consented.' },
     { code: 'Art. 12', name: 'Transparent information', desc: 'Transparent information, communication and modalities for the exercise of the rights of the data subject.' },
    { code: 'Art. 13', name: 'Information to be provided (collected from subject)', desc: 'Information to be provided where personal data are collected from the data subject.' },
    { code: 'Art. 14', name: 'Information to be provided (not obtained from subject)', desc: 'Information to be provided where personal data have not been obtained from the data subject.' },
    { code: 'Art. 15', name: 'Right of access', desc: 'The data subject shall have the right to obtain from the controller confirmation as to whether or not personal data are processed.' },
    { code: 'Art. 16', name: 'Right to rectification', desc: 'The data subject shall have the right to obtain from the controller without undue delay the rectification of inaccurate personal data.' },
    { code: 'Art. 17', name: 'Right to erasure', desc: 'The data subject shall have the right to obtain from the controller the erasure of personal data.' },
    { code: 'Art. 24', name: 'Responsibility of the controller', desc: 'Controller shall implement appropriate technical and organizational measures.' },
    { code: 'Art. 25', name: 'Data protection by design and by default', desc: 'Controller shall implement appropriate technical and organizational measures.' },
    { code: 'Art. 28', name: 'Processor', desc: 'Controller shall use only processors providing sufficient guarantees.' },
    { code: 'Art. 30', name: 'Records of processing activities', desc: 'Each controller shall maintain a record of processing activities under its responsibility.' },
    { code: 'Art. 32', name: 'Security of processing', desc: 'Controller and processor shall implement appropriate technical and organizational measures.' },
    { code: 'Art. 33', name: 'Breach notification', desc: 'Notification of a personal data breach to the supervisory authority.' },
    { code: 'Art. 34', name: 'Communication of breach to data subject', desc: 'Communication of a personal data breach to the data subject.' },
    { code: 'Art. 35', name: 'Data protection impact assessment', desc: 'Assessment of the impact of the envisaged processing operations on the protection of personal data.' },
    { code: 'Art. 37', name: 'Designation of the data protection officer', desc: 'The controller and the processor shall designate a data protection officer in any case where required.' },
  ]);

  // 4. PCI DSS v4.0
  await createStandard('PCI DSS v4.0', 'Payment Card Industry Security Standard', [
    { code: 'Req 1', name: 'Network Security', desc: 'Install and maintain network security controls' },
    { code: 'Req 3', name: 'Protect Account Data', desc: 'Protect stored account data' },
    { code: 'Req 8', name: 'Access Control', desc: 'Identify users and authenticate access' },
    { code: 'Req 11', name: 'Vulnerability Management', desc: 'Test security of systems and networks regularly' },
  ]);



  // ... (PCI DSS standard above)

  // 5. Policy Templates (Dynamic Document Library)
  console.log('Seeding Policy Templates...');
  const templates = [
      { name: 'Acceptable Use Policy', category: 'General', content: '# Acceptable Use Policy\n\n## 1. Introduction\nThis policy outlines the acceptable use of computer equipment at {{companyName}}.\n\n## 2. Scope\nAll employees...' },
      { name: 'Information Security Policy', category: 'ISO 27001', content: '# Information Security Policy\n\n## Purpose\nThe purpose of this policy is to protect the information assets of {{companyName}}...' },
      { name: 'Access Control Policy', category: 'ISO 27001', content: '# Access Control Policy\n\n## Policy Statement\nReference: A.9.1.1\nAccess to information and information processing facilities shall be restricted...' },
      { name: 'Remote Work Policy', category: 'HR', content: '# Remote Work Policy\n\n## Guidelines\nEmployees working remotely must ensure their environment is secure...' },
      { name: 'Data Classification Policy', category: 'ISO 27001', content: '# Data Classification Policy\n\n## Levels\n1. Public\n2. Internal\n3. Confidential\n4. Restricted...' },
      { name: 'Password Policy', category: 'It Security', content: '# Password Policy\n\n## Requirements\n- Minimum 12 characters\n- Mixed case, numbers, symbols...' },
      { name: 'Clean Desk Policy', category: 'Physical Security', content: '# Clean Desk Policy\n\n## Overview\nSensitive information must be secured when workspace is unattended...' },
      { name: 'Incident Management Procedure', category: 'SOC 2', content: '# Incident Management\n\n## Process\n1. Identify\n2. Contain\n3. Eradicate\n4. Recover...' },
      { name: 'Vendor Management Policy', category: 'SOC 2', content: '# Vendor Management\n\n## Due Diligence\nAll third-party vendors must undergo security assessment...' },
      { name: 'Privacy Notice (Employee)', category: 'GDPR', content: '# Privacy Notice\n\n## Your Rights\nUnder GDPR/KVKK, you have the right to access your personal data...' },
      { name: 'Social Media Policy', category: 'HR', content: '# Social Media Policy\n\n## Conduct\nEmployees must distinguish between personal and professional communications...' },
      { name: 'Mobile Device Policy', category: 'General', content: '# Mobile Device Policy\n\n## BYOD\nPersonal devices used for work must be encrypted and password protected...' }
  ];

  for (const t of templates) {
      await prisma.policyTemplate.create({
          data: { name: t.name, category: t.category, content: t.content }
      });
  }

  // 6. Admin User (Initial Access)
  console.log('Seeding Admin User...');
  const adminEmail = 'admin@kivvat.com';
  await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
          email: adminEmail,
          name: 'System Administrator',
          password: 'adminPassword123!', // Should be changed on first login
          role: 'ADMIN',
      }
  });

  console.log('Seeding finished.');
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
