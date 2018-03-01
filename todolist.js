var R = require('ramda');
var fp = require('./last/lodash/fp');
var tasks = [
    {username: 'Michael', title: 'Curry stray functions', dueDate: '2014-05-06',
               complete: true, effort: 'low', priority: 'low'},
    {username: 'Scott', title: 'Add `fork` function', dueDate: '2014-05-14', 
               complete: true, effort: 'low', priority: 'low'},    
    {username: 'Michael', title: 'Write intro doc', dueDate: '2014-05-16', 
               complete: true, effort: 'low', priority: 'low'},    
    {username: 'Michael', title: 'Add modulo function', dueDate: '2014-05-17', 
               complete: false, effort: 'low', priority: 'low'},    
    {username: 'Michael', title: 'Separating generators', dueDate: '2014-05-24', 
               complete: false, effort: 'medium', priority: 'medium'},
    {username: 'Scott', title: 'Fold algebra branch back in', dueDate: '2014-06-01', 
               complete: false, effort: 'low', priority: 'low'},
    {username: 'Scott', title: 'Fix `and`/`or`/`not`', dueDate: '2014-06-05', 
               complete: false, effort: 'low', priority: 'low'},
    {username: 'Michael', title: 'Types infrastucture', dueDate: '2014-06-06', 
               complete: false, effort: 'medium', priority: 'high'},
    {username: 'Scott', title: 'Add `mapObj`', dueDate: '2014-06-09', 
               complete: false, effort: 'low', priority: 'medium'}, 
    {username: 'Scott', title: 'Write using doc', dueDate: '2014-06-11', 
               complete: false, effort: 'medium', priority: 'high'},
    {username: 'Michael', title: 'Finish algebraic types', dueDate: '2014-06-15', 
               complete: false, effort: 'high', priority: 'high'},
    {username: 'Scott', title: 'Determine versioning scheme', dueDate: '2014-06-15', 
                complete: false, effort: 'low', priority: 'medium'},
    {username: 'Michael', title: 'Integrate types with main code', dueDate: '2014-06-22', 
               complete: false, effort: 'medium', priority: 'high'},
    {username: 'Richard', title: 'API documentation', dueDate: '2014-06-22', 
               complete: false, effort: 'high', priority: 'medium'},
    {username: 'Scott', title: 'Complete build system', dueDate: '2014-06-22', 
               complete: false, effort: 'medium', priority: 'high'},
    {username: 'Richard', title: 'Overview documentation', dueDate: '2014-06-25', 
               complete: false, effort: 'medium', priority: 'high'}
];
/**
需求：
1. 输入username, 过滤出该用户未完成的任务列表（complete为false的数据），按date降序排列, 取前5条数据，数据包含“title”、“dueDate”
2. 过滤出complete为false的数据，根据username分组，按date降序排列，每组取前5条数据，数据包含“title”、“dueDate”
**/

// Ramda V0.25.0
var incomplete = R.filter(R.whereEq({complete: false}));
var sortByDate = R.sortBy(R.prop('dueDate'));
var sortByDateDescend = R.compose(R.reverse, sortByDate);//从右往左执行
var importantFields = R.project(['title', 'dueDate']);//模拟 select 语句
var groupByUser = R.groupBy(R.prop('username'));//分组
var activeByUser = R.compose(groupByUser, incomplete);
var gloss = R.compose(importantFields, R.take(5), sortByDateDescend);
var topData = R.compose(gloss, incomplete);
var topDataAllUsers = R.compose(R.map(gloss), activeByUser);
var byUser = R.useWith(R.filter, [R.propEq("username"), R.identity]);//第1个参数传给R.propEq(“username”), 第2个传给R.identity原值返回， 最后处理好后传给R.filter

console.log("==========Ramda====================");
console.log("Gloss for Scott:");
console.log(topData(byUser("Scott", tasks)));
console.log("====================");
console.log("Gloss for everyone:");
console.log(topDataAllUsers(tasks));



// Lodash v4.17.4
console.log("=========Lodash====================");
var incomplete = fp.filter({complete: false});
var sortByDate = fp.sortBy('dueDate');
var sortByDateDescend = fp.compose(fp.reverse, sortByDate);//从右往左执行
var importantFields = fp.map(fp.pick(['title', 'dueDate']));
var groupByUser = fp.groupBy(fp.get('username'));//分组
var activeByUser = fp.compose(groupByUser, incomplete);
var gloss = fp.compose(importantFields, fp.take(5), sortByDateDescend);
var topData = fp.compose(gloss, incomplete);
var topDataAllUsers = fp.compose(fp.mapValues(gloss), activeByUser);
var byUser = fp.curry(function(username, tasks){
	return fp.filter({"username": username})(tasks);
})
console.log("Gloss for Scott:");
console.log(topData(byUser("Scott", tasks)));
console.log("====================");
console.log("Gloss for everyone:");
console.log(topDataAllUsers(tasks));