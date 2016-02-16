var fs = require('fs'),
    muilter = require('./multerUtil'),
    images = require("images"),
    User = require('./user.js');


//multer有single()中的名称必须是表单上传字段的name名称。
var upload=muilter.single('authorLogo');

exports.dataInput = function (req, res) {
    upload(req, res, function (err) {

        //错误处理
        if (err) {
            req.flash('error', err);
            res.redirect('/upload');
        }

        //判断是否有文件上传
        if (!req.file) {
            req.flash('error', "请选择上传头像");
            res.redirect('/upload');
        }

        //文件路径(临时文件路径，存储路径，数据库提取路径，创建文件夹路径)
        var tmp_path = req.file.path;
        var target_path = './public/images/user/' + req.session.user.Low_name + '/' + req.file.filename;
        var target_logo = '/images/user/' + req.session.user.Low_name + '/' + req.file.filename;
        var target_dir = './public/images/user/' + req.session.user.Low_name;

        //文件信息在req.file或者req.files中显示。
        fs.exists( target_dir, function (exists) {
            if(!exists){
                fs.mkdir(target_dir, function(err){
                    if (err) throw err;
                });
            }
            fs.rename( tmp_path, target_path, function(err) {
                if (err) throw err;
                // 删除临时文件夹文件,
                fs.unlink( tmp_path, function () {
                    if (err) throw err;
                    User.update(req.session.user.Low_name, target_logo, function (err, post) {
                        if (err) {
                            req.flash('error', err);
                            return res.redirect('/upload');
                        }
                        User.get(req.session.user.Low_name, function (err, user) {
                            if (!user) {
                                req.flash('error', '账号或密码错误!');
                                return res.redirect('/login');
                            }
                            req.session.user = user;
                            req.flash('success', '上传成功！');
                            res.redirect('/upload');
                        });
                    });
                });
            });
        });
    });
};