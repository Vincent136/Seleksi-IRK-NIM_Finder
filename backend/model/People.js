const mongoose = require('mongoose');

const PeopleSchema = new mongoose.Schema({
    Nama:{
        type:String,
        required:true
    },
    NIM_tpb: {
        type:String,
        default:""
    },
    NIM_jurusan: {
        type:String,
        default:""
    },
    Fakultas: {
        type:String,
        default:""
    },
    KodeFakultas: {
        type:String,
        default:""
    },
    Jurusan: {
        type:String,
        default:""
    },
    KodeJurusan: {
        type:String,
        default:""
    }
},
{timestamps:true}
);

module.exports = mongoose.model("People", PeopleSchema);