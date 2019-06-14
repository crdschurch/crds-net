import{h}from"../crds-components.core.js";import{a as axios}from"./chunk-fef45e2a.js";var SnailTrail=function(){function t(){this.env="prod",this.data=[]}return t.prototype.componentWillLoad=function(){var t=this;axios.get(this.src||"https://crds-data.netlify.com/snail-trails/"+this.name+"/"+this.env+".json").then(function(e){return t.data=e.data})},t.prototype.listItems=function(){return this.data.map(function(t){if("string"==typeof t)return h("span",null,t);var e={href:t.path};return t["automation-id"]&&(e["data-automation-id"]=t["automation-id"]),h("li",null,h("a",Object.assign({},e),t.title))})},t.prototype.render=function(){return 0===this.data.length?null:h("nav",null,h("div",null,h("ul",null,this.listItems())))},Object.defineProperty(t,"is",{get:function(){return"snail-trail"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{data:{state:!0},env:{type:String,attr:"env"},name:{type:String,attr:"name"},src:{type:String,attr:"src"}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"nav.sc-snail-trail{font-family:acumin-pro,helvetica,arial,sans-serif!important;font-weight:300!important;background-color:#fff;-webkit-box-shadow:0 1px 6px 0 rgba(0,0,0,.14);box-shadow:0 1px 6px 0 rgba(0,0,0,.14);font-size:14px;padding-left:20px;position:relative}\@media (min-width:1170px){nav.sc-snail-trail{padding-left:0}}nav.sc-snail-trail > div.sc-snail-trail{display:-ms-flexbox;display:flex;margin:0 auto;max-width:1170px}\@media (max-width:992px){nav.sc-snail-trail:after{background:-webkit-gradient(linear,left top,right top,from(hsla(0,0%,100%,0)),to(rgba(0,0,0,.8)));background:linear-gradient(90deg,hsla(0,0%,100%,0),rgba(0,0,0,.8));content:\"\";display:inline-block;height:100%;opacity:.3;position:absolute;right:0;top:0;width:20px}}span.sc-snail-trail{color:#4d4d4d;display:inline-block;font-weight:600;padding:11px 0;text-transform:capitalize;white-space:nowrap}span.sc-snail-trail:after{border-right:1px solid #d8d8d8;content:\"\";height:100%;margin-left:15px;width:1px}ul.sc-snail-trail{padding-left:0;-ms-flex-align:center;align-items:center;display:-ms-flexbox;display:flex;margin-bottom:0;margin-top:0;-webkit-overflow-scrolling:touch;overflow-x:scroll;overflow-y:hidden;scrollbar-width:none}ul.sc-snail-trail   li.sc-snail-trail{list-style:none}ul.sc-snail-trail::-webkit-scrollbar{display:none}a.sc-snail-trail{color:#4d4d4d;display:block;font-weight:300;padding:11px 15px;position:relative;text-decoration:none}a.is-active.sc-snail-trail:after, a.sc-snail-trail:hover:after{background-color:#0095d9;bottom:0;content:\"\";display:inline-block;height:2px;left:15px;position:absolute;width:calc(100% - 30px)}li.sc-snail-trail{display:inline-block;-ms-flex:none;flex:none;text-transform:capitalize}li.sc-snail-trail:last-of-type   a.sc-snail-trail{color:#0095d9;position:relative}li.sc-snail-trail:last-of-type   a.sc-snail-trail:before{border-right:1px solid #d8d8d8;content:\"\";display:inline-block;height:calc(100% - 22px);left:0;position:absolute;width:1px}li.sc-snail-trail:last-of-type   a.sc-snail-trail:hover{color:#0072a6}"},enumerable:!0,configurable:!0}),t}();export{SnailTrail};