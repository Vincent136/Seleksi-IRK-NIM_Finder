const router = require('express').Router();
var test = require('../data/data.json');
const People = require("../model/People");
var list_fakultas = require("../data/list_fakultas");
var list_jurusan = require("../data/list_jurusan");
var kode_fakultas = require("../data/fakultas");
var kode_jurusan_raw = require("../data/kode_jurusan");

var kode_jurusan = {};
for(var key in kode_jurusan_raw){
    kode_jurusan[kode_jurusan_raw[key]] = key;
}

var array_kode_jurusan = []
for(var key in kode_jurusan){
    array_kode_jurusan.push(kode_jurusan[key]);
}

var array_kode_fakultas = []
for(var key in kode_fakultas){
    array_kode_fakultas.push(kode_fakultas[key]);
}

var array_jurusan = []
for(var key in list_jurusan){
    array_jurusan.push(list_jurusan[key]);
}

var array_fakultas = []
for(var key in kode_fakultas){
    array_fakultas.push(list_fakultas[key]);
}

// console.log(array_kode_jurusan);
// console.log(array_jurusan);
// console.log(array_kode_fakultas);
// console.log(array_fakultas);

router.post("/", async (req, res) => {

    test.forEach(async (isi) => {
        try {
            if (isi.length == 2) {
                const kode_fakultas_new = isi[1].slice(0,3)
                const newPeople = await new People({
                    Nama: isi[0],
                    NIM_tpb: isi[1],
                    Fakultas: list_fakultas[kode_fakultas_new],
                    KodeFakultas: kode_fakultas[kode_fakultas_new]
                });    
                const people = await newPeople.save();
            } else if (isi.length == 3) {
                const kode_fakultas_new = isi[1].slice(0,3)
                const kode_jurusan_new = isi[2].slice(0,3)

                const newPeople = await new People({
                    Nama: isi[0],
                    NIM_tpb: isi[1],
                    NIM_jurusan: isi[2],
                    Fakultas: list_fakultas[kode_fakultas_new],
                    KodeFakultas: kode_fakultas[kode_fakultas_new],
                    Jurusan: list_jurusan[kode_jurusan_new],
                    KodeJurusan: kode_jurusan[kode_jurusan_new]
                });   
                const people = await newPeople.save();
            } else {
                console.log("Wrong")
            }
        }catch (e) {
            console.log(e)
        }
    });

    res.status(200).json("complete")
})

function isNIM(string) {
    if (string.match("^[0-9]+$")) {
        return true;
    }
    return false;
}

function isTahun(string) {
    if (string.match("^[0-9][0-9]$")) {
        return true;
    }
    return false;
}

function test_regex(pattern, array) {
    let output = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].match(pattern)) {
            output = output.concat(array[i])
        }
    }

    return output;
}

function type_decision(string) {
    output = []
    var re_pattern = ""
    for (var i = 0; i < string.length; i++) {
        re_pattern = re_pattern.concat("["+string[i].toUpperCase()+string[i].toLowerCase()+"]")
    }
    re_pattern = new RegExp(re_pattern)
    output.push(re_pattern)

    let jurusan_check = test_regex(re_pattern, array_jurusan)
    let fakultas_check = test_regex(re_pattern, array_fakultas)
    let kode_jurusan_check = test_regex(re_pattern, array_kode_jurusan)
    let kode_fakultas_check = test_regex(re_pattern, array_kode_fakultas)

    if ((kode_jurusan_check.length > 0)){
        output.push("no_nama")
    } else if (jurusan_check.length > 0){
        output.push("no_nama")
    } else if (kode_fakultas_check.length > 0){
        output.push("no_nama")
    } else if (fakultas_check.length > 0){
        output.push("no_nama")
    } else {
        output.push("nama")
    }

    return output
}

function searchByNIM(string) {
    return People.find({$or:[{NIM_tpb: {$regex: string}},{NIM_jurusan:{$regex: string}}]}).exec();
}

function searchByProdi(string) {
    return People.find({$or:[{KodeJurusan: {$regex: string}}, {Jurusan: {$regex: string}},{KodeFakultas: {$regex: string}},{Fakultas: {$regex: string}}]}).exec();
}

function searchByProdiTahun(string, tahun) {
    var pattern_tahun = "[0-9][0-9][0-9]" + tahun + "[0-9][0-9][0-9]"
    return People.find({$or:[{KodeJurusan: {$regex: string}, NIM_tpb: {$regex: pattern_tahun}}, {Jurusan: {$regex: string}, NIM_tpb: {$regex: pattern_tahun}},{KodeFakultas: {$regex: string},NIM_tpb: {$regex: pattern_tahun}},{Fakultas: {$regex: string},NIM_tpb: {$regex: pattern_tahun}}]}).exec();
}

router.post("/result", async function(req, res) {
    var query = req.body.Query;
    var split_query = query.split(" ");
    var counter = 0;
    let result;
    if (isNIM(split_query[counter])) {
        result = await searchByNIM(split_query[counter]);
    } else {
        var type = type_decision(split_query[counter]);
        if (type[1] == "no_nama") {
            if (split_query.length > counter + 1 && isTahun(split_query[counter + 1])) {
                result = await searchByProdiTahun(type[0], split_query[counter + 1]);
                counter += 1;
            } else {
                result = await searchByProdi(type[0])
            }
        }  else if (type[1] == "nama") {
            result = await People.find({Nama: {$regex: type[0]}}).exec();
        }
    }
    counter += 1;
    while (counter < split_query.length) {
        var resultnew;
        if (isNIM(split_query[counter])) {
            resultnew = await searchByNIM(split_query[counter]);
        } else {
            var type = type_decision(split_query[counter]);
            if (type[1] == "no_nama") {
                if (split_query.length > counter + 1 && isTahun(split_query[counter + 1])) {
                    resultnew = await searchByProdiTahun(type[0], split_query[counter + 1]);
                    counter +=1;
                } else {
                    resultnew = await searchByProdi(type[0])
                }
            } else if (type[1] == "nama") {
                resultnew = await People.find({Nama: {$regex: type[0]}}).exec();
            }
        }
        var resultUpdated = result.filter(element => resultnew.find(o => o.NIM_tpb === element.NIM_tpb));
        resultUpdated = resultUpdated.concat(result)
        resultUpdated = resultUpdated.concat(resultnew)

        resultUpdated = resultUpdated.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.NIM_tpb === value.NIM_tpb
            ))
        )

        result = resultUpdated
        counter += 1;
    }

    return res.status(200).json(result);
})

module.exports = router;