import mongoose from 'mongoose';

const nocSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    dental_council_name: {
        type: String,
        required: [true, 'Transferee Dental Council name is required']
    },

    tdc_reg_certificate_upload: {
        type: String,
        required: [true, 'TDC registration certificate is required']
    },

    aadhaar_upload: {
        type: String,
        required: [true, 'Aadhaar photocopy is required']
    },

    postal_address: {
        type: String,
        required: [true, 'Postal address is required']
    }
}, {
    timestamps: true
});
const NOC = mongoose.model('NOC', nocSchema);
export default NOC;
