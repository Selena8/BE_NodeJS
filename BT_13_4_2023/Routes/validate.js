function validate(req, res, next) {
    const name = req.body.name
    const age = req.body.age
    if(age < 0) {
        return res.status(404).json({"message": "Tuoi ban nhap bi loi!"})
    }
    else if(!/^[a-zA-Z ]+$/.test(name)) {
        return res.status(404).json({"message": "Ten ban nhap bi loi!"})
    }
    next()
}
module.exports = validate;