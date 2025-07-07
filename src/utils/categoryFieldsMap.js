const CategoryFieldsMap = {
  'Provisional Registration': {
    fields: [],
    files: [
      { name: 'pr_bds_upload', maxCount: 1 },
      { name: 'pr_bonafide_upload', maxCount: 1 },
      { name: 'ssc_memo_upload', maxCount: 1 },
      { name: 'custodian_clg_upload', maxCount: 1 }
    ]
  },

  'Bachelor of Dental Surgery (BDS) from Telangana': {
    fields: [
      'professional_address',
      'qualification_description',
      'bds_university_address',
      'bds_qualification_year',
      'bds_clg_address'
    ],
    files: [
      { name: 'bds_degree_upload', maxCount: 1 },
      { name: 'study_upload', maxCount: 1 },
      { name: 'bds_intern_upload', maxCount: 1 },
      { name: 'pr_certificate_upload', maxCount: 1 },
      { name: 'bds_affidavit_upload', maxCount: 1 },
      { name: 'ssc_memo_upload', maxCount: 1 },
      { name: 'custodian_clg_upload', maxCount: 1 }
    ]
  },

  'Transfer BDS (BDS registrant - from other state dental councils in India)': {
    fields: [
      'professional_address',
      'qualification_description',
      'bds_university_address',
      'bds_qualification_year',
      'bds_clg_address'
    ],
    files: [
      { name: 'bds_degree_upload', maxCount: 1 },
      { name: 'study_upload', maxCount: 1 },
      { name: 'bds_intern_upload', maxCount: 1 },
      { name: 'noc_dci_upload', maxCount: 1 },
      { name: 'transfer_noc_upload', maxCount: 1 },
      { name: 'ssc_memo_upload', maxCount: 1 }
    ]
  },

  'Transfer BDS + New MDS': {
    fields: [
      'professional_address',
      'qualification_description',
      'bds_university_address',
      'bds_qualification_year',
      'bds_clg_address',
      'mds_university_address',
      'mds_qualification_year',
      'mds_clg_address',
      'pg_specialist'
    ],
    files: [
      { name: 'bds_degree_upload', maxCount: 1 },
      { name: 'study_upload', maxCount: 1 },
      { name: 'bds_intern_upload', maxCount: 1 },
      { name: 'mds_degree_upload', maxCount: 1 },
      { name: 'mds_bonafide_marks_upload', maxCount: 1 },
      { name: 'curr_tdc_reg_certificate_upload', maxCount: 1 },
      { name: 'noc_dci_upload', maxCount: 1 },
      { name: 'transfer_noc_upload', maxCount: 1 },
      { name: 'ssc_memo_upload', maxCount: 1 },
      { name: 'custodian_clg_upload', maxCount: 1 },
      { name: 'mds_affidavit_upload', maxCount: 1 }
    ]
  },

  'Transfer MDS (MDS registrant - from other state dental councils in India)': {
    fields: [
      'professional_address',
      'qualification_description',
      'bds_university_address',
      'bds_qualification_year',
      'bds_clg_address',
      'mds_university_address',
      'mds_qualification_year',
      'mds_clg_address',
      'pg_specialist'
    ],
    files: [
      { name: 'bds_degree_upload', maxCount: 1 },
      { name: 'study_upload', maxCount: 1 },
      { name: 'bds_intern_upload', maxCount: 1 },
      { name: 'mds_degree_upload', maxCount: 1 },
      { name: 'mds_bonafide_marks_upload', maxCount: 1 },
      { name: 'noc_dci_upload', maxCount: 1 },
      { name: 'transfer_noc_upload', maxCount: 1 },
      { name: 'custodian_clg_upload', maxCount: 1 },
      { name: 'ssc_memo_upload', maxCount: 1 }
    ]
  },

  'Master of Dental Surgery (MDS) from Telangana': {
    fields: [
      'bds_university_address',
      'bds_qualification_year',
      'bds_clg_address',
      'mds_university_address',
      'mds_qualification_year',
      'mds_clg_address',
      'pg_specialist'
    ],
    files: [
      { name: 'bds_degree_upload', maxCount: 1 },
      { name: 'study_upload', maxCount: 1 },
      { name: 'bds_intern_upload', maxCount: 1 },
      { name: 'mds_degree_upload', maxCount: 1 },
      { name: 'mds_bonafide_marks_upload', maxCount: 1 },
      { name: 'custodian_clg_upload', maxCount: 1 },
      { name: 'curr_tdc_reg_certificate_upload', maxCount: 1 },
      { name: 'mds_affidavit_upload', maxCount: 1 }
    ]
  },

  'Non Indian Dentist Registration (Temporary)': {
    fields: [
      'nid_qualification_des',
      'dci_university_address',
      'dci_qualification_year',
      'dci_clg_address'
    ],
    files: [
      { name: 'dci_degree_upload', maxCount: 1 },
      { name: 'dci_bonafide_upload', maxCount: 1 },
      { name: 'curr_tdc_reg_certificate_upload', maxCount: 1 }
    ]
  }
};

module.exports = CategoryFieldsMap;
