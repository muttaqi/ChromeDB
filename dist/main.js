(()=>{"use strict";var e={19:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0});class n{}class o{constructor(e){this.document=e}where(e){if("string"==typeof e)throw new Error("Method not implemented.");return new Promise((function(t,n){chrome.storage.sync.get(document,(function(o){if(null!=o.document){var r=[];for(var c in o.document)e(c)&&r.push(c);t(r)}n("Error finding document")}))}))}all(){return new Promise(((e,t)=>{chrome.storage.sync.get(document,(n=>{null!=n.document&&e(n.document),t(`Error finding document ${document}`)}))}))}}class r{constructor(e){this.name=e}get(){return new o(this.name)}}class c{static init(e){var t=new c;return t.database=e,new Promise(((o,r)=>{chrome.storage.sync.get("chromedb_config",(r=>{t.config=new n,null!=r.chromedb_config?(t.config.documents=r.chromedb_config,e in t.config.documents||(t.config.documents[e]=[])):t.config.documents[e]=[],o(t)}))}))}doc(e){if(e in this.config.documents[this.database])return new r(e);throw Error(`Document ${e} doesn't belong to database ${this.database}`)}makeDoc(e){return new Promise(((t,n)=>{chrome.storage.sync.set({name:[]},(()=>{this.config.documents[this.database].push(e)}))}))}deleteDoc(e){return new Promise(((t,n)=>{chrome.storage.sync.remove(e,(()=>{this.config.documents[this.database].splice(this.config.documents[this.database].indexOf(e),1)}))}))}}t.ChromeDB=c},367:function(e,t,n){var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(r,c){function s(e){try{u(o.next(e))}catch(e){c(e)}}function i(e){try{u(o.throw(e))}catch(e){c(e)}}function u(e){e.done?r(e.value):new n((function(t){t(e.value)})).then(s,i)}u((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const r=n(19);(()=>{o(this,void 0,void 0,(function*(){yield r.ChromeDB.init("myDB")}))})()}},t={};!function n(o){if(t[o])return t[o].exports;var r=t[o]={exports:{}};return e[o].call(r.exports,r,r.exports,n),r.exports}(367)})();