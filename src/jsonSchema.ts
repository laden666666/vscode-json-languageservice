/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export type JSONSchemaRef = JSONSchema | boolean;

// Schema 的类型
// 这东西可以嵌套，用于修饰子类型
// 可参考 https://json-schema.org/understanding-json-schema/
export interface JSONSchema {
	// id 和 $id 都是 schema 的唯一id
	id?: string;
	$id?: string;
	// 核心属性，选择 schema 的版本，主要版本有：Draft 3, Draft 4, Draft 6, Draft 7 and Draft 2019-09 等
	$schema?: string;
	// ？？？ 这个描述一个 JSON，为什么会有整个文件的 type? 难道除了 JSON 对象和数组还能校验别的？？？？
	// 做了几个实验，发现确实可以校验文本，一致以为 JSONSchema 只能校验 JSON，给跪
	// 本质上是修饰子类型的，但是这样写有点那个了
	type?: string | string[];
	// title	标题	字符串	描述信息
	title?: string;
	// default	默认值	无限制	定义默认值 ？？？？？
	default?: any;
	// description	描述	字符串	更加详尽的描述信息
	description?: string;

	// 对象校验部分
	// required	必须属性	字符串数组，至少必须有一个元素，数组内不能有重复值	object实例必须有所有required定义的属性
	required?: string[];
	// 属性的类型  properties	属性	object，属性的值必须都是有效的Schema实例	用于定义属性列表
	properties?: JSONSchemaMap;
	// 用于修饰 properties 的正则，例如： "patternProperties": { "^S_": { "type": "string" },  "^I_": { "type": "integer" }。。。
	patternProperties?: JSONSchemaMap;
	additionalProperties?: boolean | JSONSchemaRef;
	// minProperties	最小属性个数	大于等于的整数	object实例的属性个数必须大于等于minProperties的值
	minProperties?: number;
	// maxProperties	最大属性个数	大于等于的整数	object实例的属性个数必须小于等于maxProperties的值
	maxProperties?: number;
	// dependencies	定义依赖	object，属性对应的值必须是object或者字符串数组。 ??????
	dependencies?: JSONSchemaMap | { [prop: string]: string[] };
	
	// 数组校验部分 
	// items	定义元素	必须是object或者array的Schema实例，如果是array则其元素也必须是object	用于定义array中的元素类型
	items?: JSONSchemaRef | JSONSchemaRef[];
	// minItems	长度限制	大于等于的整数	array实例的长度必须大于等于minItems的值
	minItems?: number;
	// maxItems	长度限制	大于等于的整数	array实例的长度必须小于等于maxItems的值
	maxItems?: number;
	// uniqueItems	唯一值	布尔值，默认值false	当uniqueItems为true的时候，array实例不能有重复值。
	uniqueItems?: boolean;
	// additionalItems	长度限制	布尔值或类型为object的Schema实例	当items为array，additionalItems为false时，json数据长度必须小于等于items长度
	additionalItems?: boolean | JSONSchemaRef;

	// 字符串校验部分
	// pattern	模式	字符串，必须是有效的正则表达式	当字符串符合正则表达式时，通过验证
	pattern?: string;
	// minLength	最小长度	大于等于0的整数	字符串的长度必须大于等于该值
	minLength?: number;
	// maxLength	最大长度	大于等于0的整数	字符串的长度必须小于等于该值
	maxLength?: number;

	// 数字校验部分
	// minimum	最小值	一个JSON数	当JSON实例的值大于等于minimum的时候，通过验证
	minimum?: number;
	// maximum	最大值	一个JSON数	当JSON实例的值小于等于maximum的时候，通过验证
	maximum?: number;
	// exclusiveMinimum	包含最小值	布尔值，必须与minimum一起使用	当其为true的时候，JSON实例不能等于minimum的值
	exclusiveMinimum?: boolean | number;
	// exclusiveMaximum	包含最大值	布尔值，必须与maximum一起使用	当其为true的时候，JSON实例不能等于maximum的值
	exclusiveMaximum?: boolean | number;
	// multipleOf	整数倍	大于0的JSON数	当JSON实例的值是其整数倍的时候，通过验证
	multipleOf?: number;

	$ref?: string;
	// anyOf	数据验证	同allOf	JSON实例满足其中某一个Schema时，通过验证
	anyOf?: JSONSchemaRef[];
	// allOf	数据验证	必须是object Schema实例数组，而且数组里面的元素至少必须有一个而且不能有重复	JSON实例满足其中所有的Schema时，通过验证
	allOf?: JSONSchemaRef[];
	// oneOf	数据验证	同allOf	JSON实例刚好只满足其中某一个Schema时，通过验证
	oneOf?: JSONSchemaRef[];
	// not	数据验证	必须是一个object，而且是个有效的JSON Schema	如果不满足JSON Schema的定义，则通过验证
	not?: JSONSchemaRef;
	// enum	数据枚举	必须是数组，而且数组里面的元素至少必须有一个而且不能有重复值。	当json实例的值存在于enum列表中时，通过验证。这里给 any???
	enum?: any[];
	// format关键字对值的固定子集进行可互操作的语义验证。
	// 这些子集已经被权威机构进行准确的描述，例如data-time、mail、hostname、ipv4等。
	format?: string;
	// definitions	定义子模式	必须是一个object，object下所有属性的值都必须是有效的JSON Schema	用于定义子模式
	definitions?: { [name: string]: JSONSchema };

	// schema draft 06
	const?: any;
	contains?: JSONSchemaRef;
	propertyNames?: JSONSchemaRef;
	examples?: any[];

	// schema draft 07
	$comment?: string;
	if?: JSONSchemaRef;
	then?: JSONSchemaRef;
	else?: JSONSchemaRef;

	// VSCode extensions
	// 这些都是 vscode 的扩展内容
	defaultSnippets?: { label?: string; description?: string; markdownDescription?: string; body?: any; bodyText?: string; }[]; // VSCode extension: body: a object that will be converted to a JSON string. bodyText: text with \t and \n
	errorMessage?: string; // VSCode extension
	patternErrorMessage?: string; // VSCode extension
	deprecationMessage?: string; // VSCode extension
	enumDescriptions?: string[]; // VSCode extension
	markdownEnumDescriptions?: string[]; // VSCode extension
	markdownDescription?: string; // VSCode extension
	doNotSuggest?: boolean; // VSCode extension
	suggestSortText?: string;  // VSCode extension
	allowComments?: boolean; // VSCode extension
	allowTrailingCommas?: boolean; // VSCode extension
}

export interface JSONSchemaMap {
	[name: string]: JSONSchemaRef;
}
