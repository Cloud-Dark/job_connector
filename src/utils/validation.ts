import { ValidationResponse } from '../types';

export const validateJobData = (input: string): ValidationResponse => {
  // Simulate AI processing - in production, this would call the actual AI service
  const requiredFields = [
    'nama perusahaan',
    'alamat',
    'email',
    'telepon',
    'posisi',
    'pendidikan',
    'pengalaman',
    'skill',
    'lokasi',
    'jenis pekerjaan'
  ];

  const inputLower = input.toLowerCase();
  const missingFields: string[] = [];

  // Check for required information
  if (!inputLower.includes('perusahaan') && !inputLower.includes('company') && !inputLower.includes('pt ')) {
    missingFields.push('Nama perusahaan');
  }
  
  if (!inputLower.includes('alamat') && !inputLower.includes('address') && !inputLower.includes('jl.') && !inputLower.includes('jalan')) {
    missingFields.push('Alamat perusahaan');
  }
  
  if (!inputLower.includes('email') && !inputLower.includes('@')) {
    missingFields.push('Email perusahaan');
  }
  
  if (!inputLower.includes('telepon') && !inputLower.includes('phone') && !inputLower.includes('021') && !inputLower.includes('081')) {
    missingFields.push('Nomor telepon');
  }
  
  if (!inputLower.includes('posisi') && !inputLower.includes('developer') && !inputLower.includes('manager') && !inputLower.includes('analyst')) {
    missingFields.push('Posisi yang dicari');
  }
  
  if (!inputLower.includes('pendidikan') && !inputLower.includes('s1') && !inputLower.includes('d3') && !inputLower.includes('sma')) {
    missingFields.push('Pendidikan minimum');
  }
  
  if (!inputLower.includes('pengalaman') && !inputLower.includes('tahun') && !inputLower.includes('year')) {
    missingFields.push('Pengalaman kerja yang dibutuhkan');
  }
  
  if (!inputLower.includes('skill') && !inputLower.includes('keahlian') && !inputLower.includes('php') && !inputLower.includes('java')) {
    missingFields.push('Skill/keahlian yang diperlukan');
  }
  
  if (!inputLower.includes('lokasi') && !inputLower.includes('jakarta') && !inputLower.includes('surabaya') && !inputLower.includes('location')) {
    missingFields.push('Lokasi kerja');
  }
  
  if (!inputLower.includes('full-time') && !inputLower.includes('part-time') && !inputLower.includes('contract') && !inputLower.includes('freelance')) {
    missingFields.push('Jenis pekerjaan (full-time/part-time/contract)');
  }

  if (missingFields.length > 0) {
    return {
      status: 'incomplete',
      message: "Data yang kamu kirim kurang lengkap. Mohon lengkapi dengan minimal menyebutkan data nama perusahaan, alamat, dan kontak yang bisa dihubungi, serta kriteria yang dibutuhkan seperti: posisi yang dicari, pendidikan minimum yang dibutuhkan, pengalaman kerja, skill/keahlian yang diperlukan, lokasi kerja, dan jenis pekerjaan (full-time/part-time/contract). Informasi tambahan seperti range gaji, tunjangan, dan deadline aplikasi akan membantu mendapatkan kandidat yang lebih tepat.",
      missing_fields: missingFields,
      example: "Contoh input lengkap: 'PT ABC Technology, alamat Jl. Sudirman No. 123 Jakarta, email hr@abc.com, telepon 021-1234567, butuh Software Developer, minimal S1 Teknik Informatika, pengalaman 2 tahun, skill PHP Laravel MySQL, kerja full-time di Jakarta, gaji 8-12 juta'"
    };
  }

  // If all required fields are present, return success with mock structured data
  return {
    status: 'success',
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
        'Berkolaborasi dengan tim untuk menyelesaikan proyek',
        'Melakukan testing dan debugging aplikasi'
      ],
      job_description: 'Bergabunglah dengan tim teknologi kami sebagai Software Developer. Kamu akan bertanggung jawab mengembangkan aplikasi web modern menggunakan teknologi terkini.',
      application_info: {
        deadline: '2025-01-31',
        application_method: 'Email ke hr@abc.com',
        required_documents: ['CV', 'Portfolio', 'Cover Letter']
      }
    }
  };
};

export const mockJobMatching = (cvFile: File): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
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
        job_recommendations: [
          {
            job_id: '1',
            company_name: 'PT ABC Technology',
            job_title: 'Software Developer',
            match_percentage: 92,
            location: 'Jakarta',
            salary_range: '8-12 juta',
            contact_info: {
              email: 'hr@abc.com',
              phone: '021-1234567'
            },
            why_matched: [
              'Pendidikan sesuai (S1 Teknik Informatika)',
              'Pengalaman 2 tahun sesuai requirement',
              'Menguasai skill yang dibutuhkan (PHP, MySQL)'
            ],
            areas_to_improve: ['Laravel framework', 'Advanced database optimization'],
            application_tips: 'Tunjukkan portfolio project PHP dan pengalaman database management Anda'
          },
          {
            job_id: '2',
            company_name: 'PT Tech Solutions',
            job_title: 'Web Developer',
            match_percentage: 85,
            location: 'Jakarta',
            salary_range: '7-10 juta',
            contact_info: {
              email: 'recruitment@techsol.com',
              phone: '021-7654321'
            },
            why_matched: [
              'Background pendidikan cocok',
              'Skill JavaScript dan PHP sesuai',
              'Lokasi Jakarta sesuai preferensi'
            ],
            areas_to_improve: ['React framework', 'API development'],
            application_tips: 'Siapkan demo project web application dan jelaskan pengalaman development Anda'
          }
        ],
        summary: {
          total_jobs_found: 2,
          best_match_percentage: 92,
          recommended_skills_to_learn: ['Laravel', 'React', 'API Development', 'Docker']
        }
      });
    }, 2000);
  });
};