var fs = require('fs'),
    muilter = require('./multerUtil'),
    images = require("images"),
    Post = require('../models/post.js');


//multer有single()中的名称必须是表单上传字段的name名称。
var upload=muilter.single('post');

exports.dataInput = function (req, res) {
    upload(req, res, function (err) {
        //添加错误处理
        if (err) {
            req.flash('error', err);
            res.redirect('/post');
            return  console.log(err);
        }

        //生成日期，用于文件夹命名
        var date = new Date();
        var time = {
            day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        };
        var target_logo = '/images/login_logo.png';

        if(req.file) {

            //文件路径(临时文件路径，存储路径，数据库提取路径，创建文件夹路径x2)
            var tmp_path = req.file.path;
            var target_path = './public/images/posts/' + time.day + '/' + req.body.title + '/' + req.file.filename;
            target_logo = '/images/posts/' + time.day + '/' + req.body.title + '/' + req.file.filename;
            var target_dir1 = './public/images/posts/' + time.day;
            var target_dir2 = './public/images/posts/' + time.day + '/' + req.body.title;

            //判断文件夹是否存在(第一层文件夹,时间)
            fs.exists(target_dir1, function (exists) {
                if (!exists) {
                    fs.mkdir(target_dir1, function (err) {
                        if (err) throw err;
                    });
                }

                //判断文件夹是否存在(第二层文件夹,标题)
                fs.exists(target_dir2, function (exists) {
                    if (!exists) {
                        fs.mkdir(target_dir2, function (err) {
                            if (err) throw err;
                        });
                    }

                    //复制黏贴到新的目录下
                    fs.rename(tmp_path, target_path, function (err) {
                        if (err) throw err;

                        // 删除临时文件
                        fs.unlink(tmp_path, function () {
                            if (err) throw err;
                        });

                        //文章内容判断与存储
                        var selectName = [
                            "分类", "管理", "安全",
                            "聊天", "编程", "经济",
                            "修正", "娱乐", "综合",
                            "信息", "机械", "其它",
                            "角色", "传送", "网页",
                            "整地", "创世"
                        ];
                        //蓝色,深蓝色,绿色,黄色,红色,灰色
                        var selectColor = [
                            "default","info", "primary", "success",
                            "warning", "danger","default"
                        ];
                        var currentUser = req.session.user,
                            tags = [req.body.tag1, req.body.tag2, req.body.tag3, req.body.tag4, req.body.tag5],
                            selectTag = [selectColor[req.body.selectTag1], selectColor[req.body.selectTag2], selectColor[req.body.selectTag3], selectColor[req.body.selectTag4], selectColor[req.body.selectTag5]];

                        var post = new Post(target_logo, currentUser.name, req.body.selectSort,
                            req.body.title, tags, req.body.about, req.body.selectCost,
                            req.body.cost, req.body.post, req.body.down, req.body.ver, selectTag);
                        console.log(post.selectTag);


                        //如果选择免费,价格改为0
                        if (post.selectCost == 0) {
                            post.cost = "免费";
                        }
                        //添加人民币符号
                        if (post.selectCost == 1) {
                            post.cost = "￥" + post.cost;
                        }

                        //将选择号码转换为字符串储存
                        post.selectSort = selectName[post.selectSort];


                        //数据恢复前端
                        function recovery() {
                            req.flash('post', req.body.post);
                            req.flash('title1', req.body.title);
                            req.flash('tag1', req.body.tag1);
                            req.flash('tag2', req.body.tag2);
                            req.flash('tag3', req.body.tag3);
                            req.flash('tag4', req.body.tag4);
                            req.flash('tag5', req.body.tag5);
                            req.flash('about', req.body.about);
                        }

                        if (req.body.selectSort <= 0) {
                            req.flash('error', '请选择插件分类!');
                            recovery();
                            return res.redirect('/post');
                        }
                        if (req.body.selectSort >= 17) {
                            req.flash('error', '请选择有效的插件分类!');
                            recovery();
                            return res.redirect('/post');
                        }
                        if (!req.body.title) {
                            req.flash('error', '请输入标题!');
                            recovery();
                            return res.redirect('/post');
                        }
                        if (!req.body.about) {
                            req.flash('error', '请输入简介!');
                            recovery();
                            return res.redirect('/post');
                        }

                        //标签验证
                        if (req.body.selectTag1 > 0) {
                            if (!req.body.tag1) {
                                req.flash('error', '请输入标签!');
                                recovery();
                                return res.redirect('/post');
                            }
                            if (req.body.tag1.length > 4) {
                                req.flash('error', '标签由1-4字符组成!');
                                recovery();
                                return res.redirect('/post');
                            }
                            if (req.body.tag1.length < 1) {
                                req.flash('error', '标签由1-4字符组成!');
                                recovery();
                                return res.redirect('/post');
                            }
                        }
                        if (req.body.selectTag2 > 0) {
                            if (!req.body.tag2) {
                                req.flash('error', '请输入标签!');
                                recovery();
                                return res.redirect('/post');
                            }
                            if (req.body.tag2.length > 4) {
                                req.flash('error', '标签由1-4字符组成!');
                                recovery();
                                return res.redirect('/post');
                            }

                            if (req.body.tag2.length < 1) {
                                req.flash('error', '标签由1-4字符组成!');
                                recovery();
                                return res.redirect('/post');
                            }
                        }
                        if (req.body.selectTag3 > 0) {
                            if (!req.body.tag3) {
                                req.flash('error', '请输入标签!');
                                recovery();
                                return res.redirect('/post');
                            }
                            if (req.body.tag3.length > 4) {
                                req.flash('error', '标签由1-4字符组成!');
                                recovery();
                                return res.redirect('/post');
                            }

                            if (req.body.tag3.length < 1) {
                                req.flash('error', '标签由1-4字符组成!');
                                recovery();
                                return res.redirect('/post');
                            }
                        }
                        if (req.body.selectTag4 > 0) {
                            if (!req.body.tag4) {
                                req.flash('error', '请输入标签!');
                                recovery();
                                return res.redirect('/post');
                            }
                            if (req.body.tag4.length > 4) {
                                req.flash('error', '标签由1-4字符组成!');
                                recovery();
                                return res.redirect('/post');
                            }

                            if (req.body.tag4.length < 1) {
                                req.flash('error', '标签由1-4字符组成!');
                                recovery();
                                return res.redirect('/post');
                            }
                        }
                        if (req.body.selectTag5 > 0) {
                            if (!req.body.tag5) {
                                req.flash('error', '请输入标签!');
                                recovery();
                                return res.redirect('/post');
                            }
                            if (req.body.tag5.length > 4) {
                                req.flash('error', '标签由1-4字符组成!');
                                recovery();
                                return res.redirect('/post');
                            }

                            if (req.body.tag5.length < 1) {
                                req.flash('error', '标签由1-4字符组成!');
                                recovery();
                                return res.redirect('/post');
                            }
                        }

                        if (req.body.cost < 0) {
                            req.flash('error', '请输入有效价格!');
                            recovery();
                            return res.redirect('/post');
                        }
                        if (post.cost.substr(1, 1) == "0") {
                            req.flash('error', '请输入有效价格!');
                            recovery();
                            return res.redirect('/post');
                        }
                        if (isNaN(req.body.cost)) {
                            req.flash('error', '请输入有效价格!');
                            recovery();
                            return res.redirect('/post');
                        }
                        if (!req.body.post) {
                            req.flash('error', '请输入描述!');
                            recovery();
                            return res.redirect('/post');
                        }

                        if (req.body.title.length > 18) {
                            req.flash('error', '标题由3-18个字符组成!');
                            recovery();
                            return res.redirect('/post');
                        }

                        if (req.body.title.length < 3) {
                            req.flash('error', '标题由3-18个字符组成!');
                            recovery();
                            return res.redirect('/post');
                        }

                        if (req.body.about.length > 65) {
                            req.flash('error', '简介由5-65个字符组成!');
                            recovery();
                            return res.redirect('/post');
                        }

                        if (req.body.about.length < 5) {
                            req.flash('error', '简介由5-65个字符组成!');
                            recovery();
                            return res.redirect('/post');
                        }

                        if (!req.body.ver) {
                            req.flash('error', '请输入插件版本!');
                            recovery();
                            return res.redirect('/post');
                        }

                        //储存数据到数据库
                        post.save(function (err) {
                            if (err) {
                                req.flash('error', err);
                                return res.redirect('/');
                            }
                            req.flash('success', '发布成功!');
                            res.redirect('/');//发表成功跳转到主页
                        });
                    });
                });
            });
        }

        //文章内容判断与存储
        var selectName = [
            "分类", "管理", "安全",
            "聊天", "编程", "经济",
            "修正", "娱乐", "综合",
            "信息", "机械", "其它",
            "角色", "传送", "网页",
            "整地", "创世"
        ];
        //蓝色,深蓝色,绿色,黄色,红色,灰色
        var selectColor = [
            "default","info", "primary", "success",
            "warning", "danger","default"
        ];
        var currentUser = req.session.user,
            tags = [req.body.tag1, req.body.tag2, req.body.tag3, req.body.tag4, req.body.tag5],
            selectTag = [selectColor[req.body.selectTag1], selectColor[req.body.selectTag2], selectColor[req.body.selectTag3], selectColor[req.body.selectTag4], selectColor[req.body.selectTag5]];

        var post = new Post(target_logo, currentUser.name, req.body.selectSort,
                            req.body.title, tags, req.body.about, req.body.selectCost,
                            req.body.cost, req.body.post, req.body.down, req.body.ver, selectTag);
        console.log(post.selectTag);


        //如果选择免费,价格改为0
        if (post.selectCost == 0) {
            post.cost = "免费";
        }
        //添加人民币符号
        if (post.selectCost == 1) {
            post.cost = "￥" + post.cost;
        }

        //将选择号码转换为字符串储存
        post.selectSort = selectName[post.selectSort];


        //数据恢复前端
        function recovery() {
            req.flash('post', req.body.post);
            req.flash('title1', req.body.title);
            req.flash('tag1', req.body.tag1);
            req.flash('tag2', req.body.tag2);
            req.flash('tag3', req.body.tag3);
            req.flash('tag4', req.body.tag4);
            req.flash('tag5', req.body.tag5);
            req.flash('about', req.body.about);
        }

        if (req.body.selectSort <= 0) {
            req.flash('error', '请选择插件分类!');
            recovery();
            return res.redirect('/post');
        }
        if (req.body.selectSort >= 17) {
            req.flash('error', '请选择有效的插件分类!');
            recovery();
            return res.redirect('/post');
        }
        if (!req.body.title) {
            req.flash('error', '请输入标题!');
            recovery();
            return res.redirect('/post');
        }
        if (!req.body.about) {
            req.flash('error', '请输入简介!');
            recovery();
            return res.redirect('/post');
        }

        //标签验证
        if (req.body.selectTag1 > 0) {
            if (!req.body.tag1) {
                req.flash('error', '请输入标签!');
                recovery();
                return res.redirect('/post');
            }
            if (req.body.tag1.length > 4) {
                req.flash('error', '标签由1-4字符组成!');
                recovery();
                return res.redirect('/post');
            }
            if (req.body.tag1.length < 1) {
                req.flash('error', '标签由1-4字符组成!');
                recovery();
                return res.redirect('/post');
            }
        }
        if (req.body.selectTag2 > 0) {
            if (!req.body.tag2) {
                req.flash('error', '请输入标签!');
                recovery();
                return res.redirect('/post');
            }
            if (req.body.tag2.length > 4) {
                req.flash('error', '标签由1-4字符组成!');
                recovery();
                return res.redirect('/post');
            }

            if (req.body.tag2.length < 1) {
                req.flash('error', '标签由1-4字符组成!');
                recovery();
                return res.redirect('/post');
            }
        }
        if (req.body.selectTag3 > 0) {
            if (!req.body.tag3) {
                req.flash('error', '请输入标签!');
                recovery();
                return res.redirect('/post');
            }
            if (req.body.tag3.length > 4) {
                req.flash('error', '标签由1-4字符组成!');
                recovery();
                return res.redirect('/post');
            }

            if (req.body.tag3.length < 1) {
                req.flash('error', '标签由1-4字符组成!');
                recovery();
                return res.redirect('/post');
            }
        }
        if (req.body.selectTag4 > 0) {
            if (!req.body.tag4) {
                req.flash('error', '请输入标签!');
                recovery();
                return res.redirect('/post');
            }
            if (req.body.tag4.length > 4) {
                req.flash('error', '标签由1-4字符组成!');
                recovery();
                return res.redirect('/post');
            }

            if (req.body.tag4.length < 1) {
                req.flash('error', '标签由1-4字符组成!');
                recovery();
                return res.redirect('/post');
            }
        }
        if (req.body.selectTag5 > 0) {
            if (!req.body.tag5) {
                req.flash('error', '请输入标签!');
                recovery();
                return res.redirect('/post');
            }
            if (req.body.tag5.length > 4) {
                req.flash('error', '标签由1-4字符组成!');
                recovery();
                return res.redirect('/post');
            }

            if (req.body.tag5.length < 1) {
                req.flash('error', '标签由1-4字符组成!');
                recovery();
                return res.redirect('/post');
            }
        }

        if (req.body.cost < 0) {
            req.flash('error', '请输入有效价格!');
            recovery();
            return res.redirect('/post');
        }
        if (post.cost.substr(1, 1) == "0") {
            req.flash('error', '请输入有效价格!');
            recovery();
            return res.redirect('/post');
        }
        if (isNaN(req.body.cost)) {
            req.flash('error', '请输入有效价格!');
            recovery();
            return res.redirect('/post');
        }
        if (!req.body.post) {
            req.flash('error', '请输入描述!');
            recovery();
            return res.redirect('/post');
        }

        if (req.body.title.length > 18) {
            req.flash('error', '标题由3-18个字符组成!');
            recovery();
            return res.redirect('/post');
        }

        if (req.body.title.length < 3) {
            req.flash('error', '标题由3-18个字符组成!');
            recovery();
            return res.redirect('/post');
        }

        if (req.body.about.length > 65) {
            req.flash('error', '简介由5-65个字符组成!');
            recovery();
            return res.redirect('/post');
        }

        if (req.body.about.length < 5) {
            req.flash('error', '简介由5-65个字符组成!');
            recovery();
            return res.redirect('/post');
        }

        if (!req.body.ver) {
            req.flash('error', '请输入插件版本!');
            recovery();
            return res.redirect('/post');
        }

        //储存数据到数据库
        post.save(function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '发布成功!');
            res.redirect('/');//发表成功跳转到主页
        });
    });
};