const CategoryFieldsMap = {
  'Provisional Registration': [
    { name: 'pr_bds_upload', maxCount: 1 },
    { name: 'pr_bonafide_upload', maxCount: 1 },
    { name: 'ssc_memo', maxCount: 1 },
    { name: 'custodian_clg', maxCount: 1 }
  ],
  'Bachelor of Dental Surgery (BDS) from Telangana': [
    { name: 'bds_degree_upload', maxCount: 1 },
    { name: 'study_upload', maxCount: 1 },
    { name: 'intern_upload', maxCount: 1 },
    { name: 'pr_certificate_upload', maxCount: 1 },
    { name: 'bds_affidavit_upload', maxCount: 1 },
    { name: 'ssc_memo', maxCount: 1 },
    { name: 'custodian_clg', maxCount: 1 }
  ],
  'Transfer BDS (BDS registrant - from other state dental councils in India)': [
    { name: 'bds_degree_upload', maxCount: 1 },
    { name: 'study_upload', maxCount: 1 },
    { name: 'bds_intern_upload', maxCount: 1 },
    { name: 'noc_dci_upload', maxCount: 1 },
    { name: 'transfer_noc_upload', maxCount: 1 },
    { name: 'ssc_memo', maxCount: 1 }
  ],
  'Transfer BDS + New MDS': [
    { name: 'bds_degree_upload', maxCount: 1 },
    { name: 'study_upload', maxCount: 1 },
    { name: 'bds_intern_upload', maxCount: 1 },
    { name: 'mds_degree_upload', maxCount: 1 },
    { name: 'mds_bonafide_marks_upload', maxCount: 1 },
    { name: 'current_tdc_reg_certificate', maxCount: 1 },
    { name: 'noc_dci_upload', maxCount: 1 },
    { name: 'transfer_noc_upload', maxCount: 1 },
    { name: 'ssc_memo', maxCount: 1 },
    { name: 'custodian_clg', maxCount: 1 },
    { name: 'mds_affidavit', maxCount: 1 }
  ],
  'Transfer MDS (MDS registrant - from other state dental councils in India)': [
    { name: 'bds_degree_upload', maxCount: 1 },
    { name: 'study_upload', maxCount: 1 },
    { name: 'bds_intern_upload', maxCount: 1 },
    { name: 'mds_degree_upload', maxCount: 1 },
    { name: 'mds_bonafide_marks_upload', maxCount: 1 },
    { name: 'noc_dci_upload', maxCount: 1 },
    { name: 'transfer_noc_upload', maxCount: 1 },
    { name: 'custodian_clg', maxCount: 1 },
    { name: 'ssc_memo', maxCount: 1 }
  ],
  'Master of Dental Surgery (MDS) from Telangana': [
    { name: 'bds_degree_upload', maxCount: 1 },
    { name: 'study_upload', maxCount: 1 },
    { name: 'bds_intern_upload', maxCount: 1 },
    { name: 'mds_degree_upload', maxCount: 1 },
    { name: 'mds_bonafide_marks_upload', maxCount: 1 },
    { name: 'custodian_clg', maxCount: 1 },
    { name: 'current_tsddc_reg_certificate', maxCount: 1 },
    { name: 'mds_affidavit', maxCount: 1 }
  ],
  'Non Indian Dentist Registration (Temporary)': [
    { name: 'dci_degree_upload', maxCount: 1 },
    { name: 'dci_bonafide_upload', maxCount: 1 },
    { name: 'current_tdc_reg_certificate', maxCount: 1 }
  ]
};

module.exports = CategoryFieldsMap;