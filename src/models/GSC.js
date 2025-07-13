import mongoose from 'mongoose';

const gscSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    tdc_reg_certificate_upload: {
        type: String,
        required: [true, 'TDC registration certificate is required']
    },

    testimonial_d1_upload: {
        type: String,
        required: [true, 'Testimonial of Dentist 1 is required']
    },

    testimonial_d2_upload: {
        type: String,
        required: [true, 'Testimonial of Dentist 2 is required']
    },

    aadhaar_upload: {
        type: String,
        required: [true, 'Aadhaar photocopy is required']
    },

    tdc_reg_d1_upload: {
        type: String,
        required: [true, 'Valid TDC Registration certificate of Dentist 1 is required']
    },

    tdc_reg_d2_upload: {
        type: String,
        required: [true, 'Valid TDC Registration certificate of Dentist 2 is required']
    },

    postal_address: {
        type: String,
        required: [true, 'Postal address is required']
    }
}, {
    timestamps: true
});

const GSC = mongoose.model('GSC', gscSchema);
export default GSC;

