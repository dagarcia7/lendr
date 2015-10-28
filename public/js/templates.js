(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['item-borrow'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "<div class='item' id=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1._id : stack1), depth0))
    + "\">\n    "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.description : stack1), depth0))
    + " | "
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.owner : stack1)) != null ? stack1.email : stack1), depth0))
    + "\n    <form class='item-return'>\n        <input class='display-none' value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1._id : stack1), depth0))
    + "\"></input>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.returned : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </form>\n</div>\n";
},"2":function(depth0,helpers,partials,data) {
  return "        <button class='button tiny radius right' type='submit' disabled=true >Submitted for Return</button>\n";
  },"4":function(depth0,helpers,partials,data) {
  return "        <button class='button tiny radius right' type='submit'>Return</button>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.borrowedItems : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});
templates['item-owned'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class='item cf' id=\""
    + escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"_id","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"left\">"
    + escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper)))
    + "</div>\n    <button class=\"button tiny radius alert right\" id=\"open-modal-item-owned-delete\"><i class=\"fi-trash\"></i> Delete</button>\n</div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.items : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});
templates['item-request'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda, buffer = "<div class='item cf' id=\""
    + escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"_id","hash":{},"data":data}) : helper)))
    + "\" data-itemId=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1._id : stack1), depth0))
    + "\">\n    <div class=\"left\"><div>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.description : stack1), depth0))
    + " requested by "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.borrower : depth0)) != null ? stack1.name : stack1), depth0))
    + " </div>\n    <div>Incentive: ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.incentive : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\n    <div>\n        <span>Trustability:</span>\n        <span class=\"rateit\" data-rateit-value=\""
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.borrower : depth0)) != null ? stack1.trustability : stack1)) != null ? stack1.value : stack1), depth0))
    + "\" data-rateit-ispreset=\"true\" data-rateit-readonly=\"true\"></span>\n        <span>("
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.borrower : depth0)) != null ? stack1.trustability : stack1)) != null ? stack1.transactions : stack1), depth0))
    + ")</span>\n    </div>\n</div>\n<div class='right'>\n    <form class='request-approve'>\n        <input class='display-none' value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.borrower : depth0)) != null ? stack1._id : stack1), depth0))
    + "\"></input>\n        <input class='display-none' value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1._id : stack1), depth0))
    + "\"></input>\n        <input class='display-none' value=\""
    + escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"_id","hash":{},"data":data}) : helper)))
    + "\">\n        <button class='button tiny success radius'><i class=\"fi-check\"></i> Approve </button>\n    </form>\n    <form class='request-deny'>\n        <input class='display-none' value=\""
    + escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"_id","hash":{},"data":data}) : helper)))
    + "\"></input>\n        <button class='button tiny alert radius'><i class=\"fi-x\"></i> Deny </button>\n    </form>\n</div>\n</div>\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.incentive || (depth0 != null ? depth0.incentive : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"incentive","hash":{},"data":data}) : helper)));
  },"4":function(depth0,helpers,partials,data) {
  return "None";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.requests : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "<script src=\"/js/rateit.js\"></script>\n";
},"useData":true});
templates['item-return'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "<div class='item' id=\""
    + escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"_id","hash":{},"data":data}) : helper)))
    + "\" data-itemId=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1._id : stack1), depth0))
    + "\">\n    "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.description : stack1), depth0))
    + "\n    <div class='right'>\n        <form class='return-approve'>\n            <input class='display-none' value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.borrower : depth0)) != null ? stack1._id : stack1), depth0))
    + "\"></input>\n            <input class='display-none' value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1._id : stack1), depth0))
    + "\"></input>\n            <input class='display-none' value=\""
    + escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"_id","hash":{},"data":data}) : helper)))
    + "\">\n            <button class='button tiny success radius'><i class=\"fi-check\"></i> Approve </button>\n        </form>\n        <form class='return-deny'>\n            <input class='display-none' value=\""
    + escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"_id","hash":{},"data":data}) : helper)))
    + "\"></input>\n            <button class='button tiny alert radius'><i class=\"fi-x\"></i> Deny </button>\n        </form>\n    </div>\n</div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.returns : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});
templates['item-search'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "<tr class=\"item\">\n    <td>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.description : stack1), depth0))
    + "</td>\n    <td>"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.owner : stack1)) != null ? stack1.location : stack1), depth0))
    + "</td>\n    <td>\n        <span class=\"rateit\" data-rateit-value=\""
    + escapeExpression(lambda(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.owner : stack1)) != null ? stack1.trustability : stack1)) != null ? stack1.value : stack1), depth0))
    + "\" data-rateit-ispreset=\"true\" data-rateit-readonly=\"true\"></span>\n        ("
    + escapeExpression(lambda(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.owner : stack1)) != null ? stack1.trustability : stack1)) != null ? stack1.transactions : stack1), depth0))
    + ")\n    </td>\n    <td>\n        <input class=\"display-none\" value="
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1._id : stack1), depth0))
    + ">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.requested : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </td>\n</tr>\n";
},"2":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "        <button class='button tiny radius right' id=\"open-modal-item-request item-button-"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1._id : stack1), depth0))
    + "\" disabled=true><span id=\"item-button-"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1._id : stack1), depth0))
    + "\">Requested</span></button>\n";
},"4":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "        <button class='button tiny radius right' id=\"open-modal-item-request\"><span id=\"item-button-"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1._id : stack1), depth0))
    + "\">Request</span></button>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.items : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "<script src=\"/js/rateit.js\"></script>\n";
},"useData":true});
templates['settings-info'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<div class=\"item\">Name: "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.owner : depth0)) != null ? stack1.name : stack1), depth0))
    + "</div>\n<div class=\"item\">Location: "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.owner : depth0)) != null ? stack1.location : stack1), depth0))
    + "</div>\n";
},"useData":true});
})();
