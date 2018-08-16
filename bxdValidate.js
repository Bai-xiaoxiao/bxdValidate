function bxdValidate() {
	this.res = true;
	this.resultArr = [];
	this.dataMsg = arguments;

	//初始化时需要加上事件，并不会进行验证
	this.init(this.dataMsg);
}

bxdValidate.prototype = {
	init: function(obj) {
		//初始化，只是绑定事件
		var self = this;
		$.each(obj, function(index, val) {
			//默认为blur
			$(val.el).blur(function() {
				self.checkOne(index)
			});
		});
	},
	//检测单个规则
	checkOne: function(index) {
		var val = this.dataMsg[index],
			el = $(val.el),
			value = el.val(),
			suc = val.success,
			err = val.err,
			res;
		res = this.checkRules(val.reg || val.noReg, value); //检测结果
		this.showResult(res, el, suc, err); //执行结果回调
		this.resultArr.push(res); //保存结果
	},
	//检测所有规则
	checkAll: function() {
		var self = this;
		this.resultArr = [];
		$.each(self.dataMsg, function(index, val) {
			var el = $(val.el),
				value = el.val(),
				suc = val.success,
				err = val.err,
				res;
			res = self.checkRules(val.reg || val.noReg, value); //检测结果
			self.showResult(res, el, suc, err); //执行结果回调
			self.resultArr.push(res); //保存结果
		});
		this.res = this.returnResult(this.resultArr); //修改总体返回值
	},
	initSuccess: function(el) {
		el.css('borderColor', 'inherit');
		el.siblings('.errMsg').remove();
	},
	initError: function(el) {
		el.css('borderColor', 'red');
		if(el.siblings('.errMsg').length != 0) {
			return;
		}
		el.parent().append('<span class="errMsg">非法输入</span>');
	},
	checkRules: function(reg, val) {
		//如果reg是正则
		var res;
		if(Object.prototype.toString.call(reg) === "[object RegExp]") {
			res = reg.test(val);
		} else if(Object.prototype.toString.call(reg) === "[object Function]") {
			res = reg(val);
		} else {
			res = true; //不传任何规则默认为true
		}
		return res;
	},
	showResult: function(res, el, success, err) {
		//根据结果执行毁掉
		if(res) {
			if(success) {
				success(el);
			} else {
				this.initSuccess(el);
				//问题，第二次成功之后，怎么去除第一次失败的样式
			}
		} else {
			if(err) {
				err(el);
			} else {
				this.initError(el);
			}
		}
	},
	returnResult: function(resultArr) {
		var result = true;
		$.each(resultArr, function(i, v) {
			if(!v) {
				result = false;
			}
		});
		return result;
	}
}