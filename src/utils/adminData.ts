import { AdminConfig, JobPosting, CVSubmission, CaptchaChallenge } from '../types';

// Default admin configuration
export const defaultAdminConfig: AdminConfig = {
  gemini_api_key: '',
  job_processing_prompt: `Anda adalah AI Job Description Processor yang bertugas memvalidasi dan mengubah input mentah dari HR menjadi job description yang terstruktur.

TAHAP 1 - VALIDASI DATA WAJIB:
Periksa apakah input mengandung minimal data berikut:
- Nama perusahaan
- Alamat perusahaan  
- Kontak yang bisa dihubungi (email/telepon)
- Posisi/jabatan yang dicari
- Kriteria pendidikan minimum
- Pengalaman kerja yang dibutuhkan
- Skill/keahlian yang diperlukan
- Lokasi kerja
- Jenis pekerjaan (full-time/part-time/contract)

JIKA DATA TIDAK LENGKAP, BERIKAN RESPONSE:
{
  "status": "incomplete",
  "message": "Data yang kamu kirim kurang lengkap. Mohon lengkapi dengan minimal menyebutkan data nama perusahaan, alamat, dan kontak yang bisa dihubungi, serta kriteria yang dibutuhkan seperti: posisi yang dicari, pendidikan minimum yang dibutuhkan, pengalaman kerja, skill/keahlian yang diperlukan, lokasi kerja, dan jenis pekerjaan (full-time/part-time/contract). Informasi tambahan seperti range gaji, tunjangan, dan deadline aplikasi akan membantu mendapatkan kandidat yang lebih tepat.",
  "missing_fields": ["array - field yang masih kurang"],
  "example": "Contoh input lengkap: 'PT ABC Technology, alamat Jl. Sudirman No. 123 Jakarta, email hr@abc.com, telepon 021-1234567, butuh Software Developer, minimal S1 Teknik Informatika, pengalaman 2 tahun, skill PHP Laravel MySQL, kerja full-time di Jakarta, gaji 8-12 juta'"
}

JIKA DATA LENGKAP, LANJUTKAN KE TAHAP 2:

TAHAP 2 - PEMROSESAN DATA:
INPUT: Raw text dari HR berisi kebutuhan posisi kerja
OUTPUT: JSON terstruktur dengan format yang telah ditentukan.`,
  cv_processing_prompt: `Anda adalah AI CV Analyzer yang bertugas mengekstrak informasi dari CV dan memberikan rekomendasi pekerjaan.

TAHAP 1 - EKSTRAKSI CV:
Ekstrak informasi lengkap dari CV kandidat

TAHAP 2 - JOB MATCHING:
Cocokkan profil kandidat dengan database pekerjaan berdasarkan kriteria yang telah ditentukan.`,
  matching_parameters: {
    education_weight: 25,
    experience_weight: 30,
    technical_skills_weight: 25,
    soft_skills_weight: 10,
    location_weight: 10
  },
  approval_settings: {
    auto_approve_jobs: false,
    auto_approve_cvs: false,
    require_captcha: true
  }
};

// Mock data storage
let adminConfig = { ...defaultAdminConfig };
let jobPostings: JobPosting[] = [
  {
    id: '1',
    job_data: {
      job_title: 'Software Developer',
      company_info: {
        company_name: 'PT ABC Technology',
        address: 'Jl. Sudirman No. 123 Jakarta',
        contact: {
          email: 'hr@abc.com',
          phone: '021-1234567',
          website: 'www.abc.com'
        }
      },
      job_details: {
        job_level: 'mid',
        employment_type: 'full-time',
        location: 'Jakarta',
        department: 'Engineering',
        remote_option: 'hybrid'
      },
      compensation: {
        salary_range: {
          min: 8000000,
          max: 12000000,
          currency: 'IDR'
        },
        benefits: ['BPJS', 'Asuransi Kesehatan', 'Bonus Tahunan']
      },
      requirements: {
        education: {
          min_degree: 'S1',
          preferred_major: ['Teknik Informatika', 'Sistem Informasi']
        },
        experience: {
          min_years: 2,
          preferred_industry: ['Technology', 'Software']
        },
        skills: {
          technical_skills: ['PHP', 'Laravel', 'MySQL'],
          preferred_skills: ['React', 'Node.js'],
          soft_skills: ['Komunikasi', 'Kerja Tim', 'Problem Solving']
        },
        certifications: [],
        languages: ['Indonesian', 'English']
      },
      responsibilities: [
        'Mengembangkan aplikasi web menggunakan PHP Laravel',
        'Mengelola database MySQL',
        'Berkolaborasi dengan tim untuk menyelesaikan proyek'
      ],
      job_description: 'Bergabunglah dengan tim teknologi kami sebagai Software Developer.',
      application_info: {
        deadline: '2025-01-31',
        application_method: 'Email ke hr@abc.com',
        required_documents: ['CV', 'Portfolio', 'Cover Letter']
      }
    },
    status: 'approved',
    submitted_at: '2025-01-15T10:30:00Z',
    reviewed_at: '2025-01-15T14:20:00Z',
    reviewed_by: 'admin'
  },
  {
    id: '2',
    job_data: {
      job_title: 'Frontend Developer',
      company_info: {
        company_name: 'PT Digital Solutions',
        address: 'Jl. Thamrin No. 456 Jakarta',
        contact: {
          email: 'careers@digital.com',
          phone: '021-9876543'
        }
      },
      job_details: {
        job_level: 'junior',
        employment_type: 'full-time',
        location: 'Jakarta',
        department: 'Development',
        remote_option: 'remote'
      },
      compensation: {
        salary_range: {
          min: 6000000,
          max: 9000000,
          currency: 'IDR'
        },
        benefits: ['BPJS', 'Flexible Hours']
      },
      requirements: {
        education: {
          min_degree: 'S1',
          preferred_major: ['Teknik Informatika', 'Desain Grafis']
        },
        experience: {
          min_years: 1,
          preferred_industry: ['Technology', 'Digital Agency']
        },
        skills: {
          technical_skills: ['React', 'JavaScript', 'CSS'],
          preferred_skills: ['TypeScript', 'Next.js'],
          soft_skills: ['Kreativitas', 'Detail Oriented']
        },
        certifications: [],
        languages: ['Indonesian', 'English']
      },
      responsibilities: [
        'Mengembangkan user interface yang responsif',
        'Berkolaborasi dengan tim design',
        'Optimasi performa aplikasi web'
      ],
      job_description: 'Kami mencari Frontend Developer yang passionate dengan teknologi terbaru.',
      application_info: {
        deadline: '2025-02-15',
        application_method: 'Email ke careers@digital.com',
        required_documents: ['CV', 'Portfolio']
      }
    },
    status: 'pending',
    submitted_at: '2025-01-16T09:15:00Z'
  }
];

let cvSubmissions: CVSubmission[] = [
  {
    id: '1',
    candidate_profile: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '081234567890',
      education: {
        degree: 'S1',
        major: 'Teknik Informatika',
        university: 'Universitas Indonesia',
        graduation_year: 2022
      },
      experience: {
        total_years: 2,
        positions: [
          {
            title: 'Junior Developer',
            company: 'PT XYZ',
            duration: '2022-2024',
            responsibilities: ['Web Development', 'Database Management']
          }
        ]
      },
      skills: {
        technical_skills: ['PHP', 'JavaScript', 'MySQL'],
        soft_skills: ['Communication', 'Teamwork', 'Problem Solving']
      },
      certifications: ['AWS Cloud Practitioner'],
      languages: ['Indonesian', 'English'],
      location_preference: 'Jakarta'
    },
    status: 'approved',
    submitted_at: '2025-01-14T16:45:00Z',
    reviewed_at: '2025-01-15T08:30:00Z',
    reviewed_by: 'admin',
    file_name: 'john_doe_cv.pdf'
  },
  {
    id: '2',
    candidate_profile: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '081987654321',
      education: {
        degree: 'S1',
        major: 'Sistem Informasi',
        university: 'Institut Teknologi Bandung',
        graduation_year: 2023
      },
      experience: {
        total_years: 1,
        positions: [
          {
            title: 'Intern Developer',
            company: 'PT Tech Startup',
            duration: '2023-2024',
            responsibilities: ['Frontend Development', 'UI/UX Design']
          }
        ]
      },
      skills: {
        technical_skills: ['React', 'JavaScript', 'HTML', 'CSS'],
        soft_skills: ['Creativity', 'Fast Learner', 'Adaptability']
      },
      certifications: [],
      languages: ['Indonesian', 'English'],
      location_preference: 'Jakarta'
    },
    status: 'pending',
    submitted_at: '2025-01-16T11:20:00Z',
    file_name: 'jane_smith_cv.pdf'
  }
];

// Admin data management functions
export const getAdminConfig = (): AdminConfig => {
  return { ...adminConfig };
};

export const updateAdminConfig = (newConfig: AdminConfig): void => {
  adminConfig = { ...newConfig };
};

export const getAllJobPostings = (): JobPosting[] => {
  return [...jobPostings];
};

export const getApprovedJobPostings = (): JobPosting[] => {
  return jobPostings.filter(job => job.status === 'approved');
};

export const getAllCVSubmissions = (): CVSubmission[] => {
  return [...cvSubmissions];
};

export const getApprovedCVSubmissions = (): CVSubmission[] => {
  return cvSubmissions.filter(cv => cv.status === 'approved');
};

export const approveJobPosting = (id: string): void => {
  const job = jobPostings.find(j => j.id === id);
  if (job) {
    job.status = 'approved';
    job.reviewed_at = new Date().toISOString();
    job.reviewed_by = 'admin';
  }
};

export const rejectJobPosting = (id: string): void => {
  const job = jobPostings.find(j => j.id === id);
  if (job) {
    job.status = 'rejected';
    job.reviewed_at = new Date().toISOString();
    job.reviewed_by = 'admin';
  }
};

export const approveCVSubmission = (id: string): void => {
  const cv = cvSubmissions.find(c => c.id === id);
  if (cv) {
    cv.status = 'approved';
    cv.reviewed_at = new Date().toISOString();
    cv.reviewed_by = 'admin';
  }
};

export const rejectCVSubmission = (id: string): void => {
  const cv = cvSubmissions.find(c => c.id === id);
  if (cv) {
    cv.status = 'rejected';
    cv.reviewed_at = new Date().toISOString();
    cv.reviewed_by = 'admin';
  }
};

export const addJobPosting = (jobData: any): string => {
  const id = (jobPostings.length + 1).toString();
  const newJob: JobPosting = {
    id,
    job_data: jobData,
    status: adminConfig.approval_settings.auto_approve_jobs ? 'approved' : 'pending',
    submitted_at: new Date().toISOString(),
    ...(adminConfig.approval_settings.auto_approve_jobs && {
      reviewed_at: new Date().toISOString(),
      reviewed_by: 'system'
    })
  };
  jobPostings.push(newJob);
  return id;
};

export const addCVSubmission = (candidateProfile: any, fileName: string): string => {
  const id = (cvSubmissions.length + 1).toString();
  const newCV: CVSubmission = {
    id,
    candidate_profile: candidateProfile,
    status: adminConfig.approval_settings.auto_approve_cvs ? 'approved' : 'pending',
    submitted_at: new Date().toISOString(),
    file_name: fileName,
    ...(adminConfig.approval_settings.auto_approve_cvs && {
      reviewed_at: new Date().toISOString(),
      reviewed_by: 'system'
    })
  };
  cvSubmissions.push(newCV);
  return id;
};

export const generateCaptcha = (): CaptchaChallenge => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operations = ['+', '-', '*'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let answer: number;
  let question: string;
  
  switch (operation) {
    case '+':
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
      break;
    case '-':
      answer = Math.max(num1, num2) - Math.min(num1, num2);
      question = `${Math.max(num1, num2)} - ${Math.min(num1, num2)} = ?`;
      break;
    case '*':
      answer = num1 * num2;
      question = `${num1} × ${num2} = ?`;
      break;
    default:
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
  }
  
  return { question, answer };
};