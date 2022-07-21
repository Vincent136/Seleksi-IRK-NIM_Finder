var list_fakultas = require("./list_fakultas");
var list_jurusan = require("./list_jurusan");
var kode_fakultas = require("./fakultas");
var kode_jurusan_raw = require("./kode_jurusan");
var data = require("./data.json")

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
for(var key in kode_jurusan){
    array_jurusan.push(list_jurusan[key]);
}

var array_fakultas = []
for(var key in kode_fakultas){
    array_fakultas.push(list_fakultas[key]);
}

for (var i = 0; i < data.length; i++) {
    if (data[i].length == 2) {
        const kode_fakultas_new = data[i][1].slice(0,3)
        data[i].push(kode_fakultas[kode_fakultas_new])
        data[i].push(list_fakultas[kode_fakultas_new])
    } else {
        const kode_fakultas_new = data[i][1].slice(0,3)
        const kode_jurusan_new = data[i][2].slice(0,3)
        data[i].push(kode_fakultas[kode_fakultas_new])
        data[i].push(list_fakultas[kode_fakultas_new])
        data[i].push(kode_jurusan[kode_jurusan_new])
        data[i].push(list_jurusan[kode_jurusan_new])
    }
}

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
    let output = []
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
    let result = [];
    let re_pattern = new RegExp(string)
    for (var i = 0; i < data.length; i++) {
        if (data[i][1].match(re_pattern)) {
            result.push(data[i])
        }
        else if(data[i].length === 3) {
            if (data[i][2].match(re_pattern)) {
                result.push(data[i])
            }
        }
    }
    return result;
}

function searchByProdiTahun(string, tahun) {
    let result = [];
    let re_pattern = new RegExp(string)
    var pattern_tahun = new RegExp("[0-9][0-9][0-9]" + tahun + "[0-9][0-9][0-9]")
    for (var i = 0; i < data.length; i++) {
        if (data[i]) {

        }
    }
}

export default function nimFinder(query) {
    // console.log(array_kode_jurusan);
    // console.log(array_kode_fakultas);
    // console.log(array_jurusan);
    // console.log(array_fakultas);
    console.log(data[1])
    var split_query = query.split(" ");
    var counter = 0;
    let result;
    if (isNIM(split_query[counter])) {
        result = searchByNIM(split_query[counter]);
        console.log(result)
    }
    // } else {
    //     var type = type_decision(split_query[counter]);
    //     if (type[1] == "no_nama") {
    //         if (split_query.length > counter + 1 && isTahun(split_query[counter + 1])) {
    //             result = await searchByProdiTahun(type[0], split_query[counter + 1]);
    //             counter += 1;
    //         } else {
    //             result = await searchByProdi(type[0])
    //         }
    //     }  else if (type[1] == "nama") {
    //         result = await People.find({Nama: {$regex: type[0]}}).exec();
    //     }
    // }
    counter += 1;
}