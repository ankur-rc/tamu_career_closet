(function () {
    'use strict';

    angular
        .module('fleet')
        .service('RuleBuilderEngineService', Service);

    Service.$inject = ['API', '$http', '$timeout', '$httpParamSerializerJQLike', 'Upload'];

    /* @ngInject */
    function Service(API, $http, $timeout, $httpParamSerializerJQLike, Upload) {
        //http
        //rule builder
        this.initData = initData;
        this.getMessageModel = getMessageModel;
        this.submitRule = submitRule;
        this.getPluggableModels = getPluggableModels;

        //batch rule
        this.initBatchRuleData = initBatchRuleData;
        this.submitBatchRule = submitBatchRule;
        this.getSparkAppId = getSparkAppId;
        this.getSparkJobsData = getSparkJobsData;

        //custom rule asset
        this.uploadCustomRuleAsset = uploadCustomRuleAsset;
        this.getCustomRuleAssets = getCustomRuleAssets;
        this.getCustomRuleFilters = getCustomRuleFilters;


        //core engine
        this.ruleExpressionParser = ruleExpressionParser
        this.operatorExpressionMapper = operatorExpressionMapper;
        this.getOperatorMap = getOperatorMap;
        this.filterMapper = filterMapper;



        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //initialise data for rule engine - messageModel and notificationTemplate Ids.
        function initData() {
            return $http({
                url: API + "/ruleBuilderInitData",
                method: 'GET'
            });
        }

        //get messageModelTemplate for provided Id.
        function getMessageModel(id) {
            return $http({
                url: API + "ruleBuilder/ruleFilters/"+id,
                method: 'GET'
            });
        }

        //get Machine Learning Models and Arithmetic Expressions
        function getPluggableModels(subdomainId) {
            return $http({
                url: API + "/pluggableModel/getModels",
                method: 'GET',
                params: {
                    "subDomainId": subdomainId
                }
            });
        }

        //custom rule asset upload
        function uploadCustomRuleAsset(form) {
            return Upload.upload({
                url: API + '/customRuleAsset/uploadCustomAsset',
                data: {
                    jar: form.files[0].data,
                    customModel: form.files[1].data
                },
                params: {
                    customModelName: form.files[1].data.name,
                    jarName: form.files[0].data.name,
                    jarExecutionPath: form.jarExecutionPath,
                    vehicleTypeId: form.vehicleTypeId
                }
            });
        }

        //custom rule assets fetch
        function getCustomRuleAssets(vehicleTypeId) {
            return $http({
                url: API + "/customRuleAsset/getCRAByVehicleType",
                method: 'GET',
                params: {
                    "vehicleTypeId": vehicleTypeId
                }
            });
        }

        function getCustomRuleFilters(messageModelName, vehicleTypeId) {
            return $http({
                url: API + "/customRuleAsset/getCustomRuleFilters",
                method: 'GET',
                params: {
                    "vehicleTypeId": vehicleTypeId,
                    "messageModelName": messageModelName
                }
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //core parser that converts 'getRules' returned 'rules' from QueryBuilder to required JSON object.
        function ruleExpressionParser(data, condition, ruleType, template) {
            var rules = [];

            rules.push({
                key: 'exp',
                value: '('
            });

            for (var i = 0; i < data.rules.length; i++) {
                if (data.rules[i].condition !== undefined) {
                    var recursionResult = this.ruleExpressionParser(data.rules[i],
                        data.rules[i].condition, ruleType, template);
                    rules = rules.concat(recursionResult);
                } else {

                    rules.push(this.operatorExpressionMapper(data.rules[i], ruleType, template));
                }

                if (data.rules.length - 1 !== i) {
                    rules.push({
                        key: 'op',
                        value: condition
                    });
                }
            }

            rules.push({
                key: 'exp',
                value: ')'
            });

            return rules;
        }

        //maps operator value, filter value to actual value to be used in JSON object. Used internally by ruleExpressionParser.
        function operatorExpressionMapper(rule, ruleType, template) {


            function intOrString(type, value) {
                switch (type) {
                    case 'integer':
                        return value;
                    case 'string':
                        return "'" + value + "'";
                }
            }

            var operators = this.getOperatorMap();
            var expression = undefined;
            var operator;
            var dataType;
            var returnJSON = {};

            for (var i = 0; i < operators.length; i++) {
                if (operators[i].type === rule.operator) {
                    operator = operators[i];
                    break;
                }
            }

            for (var i = 0; i < template.length; i++) {
                if (template[i].id === rule.id) {
                    dataType = template[i].type;
                    break;
                }
            }

            //console.log(operator);
            if (rule.parentKey == 'machineLearning' || rule.parentKey == 'arithmetic') {

                var type = rule.parentKey == 'machineLearning' ? 'ml' : 'ar';

                var value = rule.value === null ? '' : rule.value.replace(/\s+/g, '');
                expression = "[?(@.modelName=='" + rule.field + "' && @." +
                    operator.displayvalue + " " + intOrString(dataType, value) + ")]";

                returnJSON = {
                    key: "alg",
                    alg: {
                        type: type,
                        name: rule.field
                    },
                    value: expression
                };


            } else {
                switch (operator.type) {
                    case 'mode in':
                        var valueList = rule.value.replace(/\s+/g, '').split(',');
                        var valueExpression = '';
                        var partialValueExpression = "(";

                        for (var index = 0; index < valueList.length; index++) {
                            partialValueExpression = partialValueExpression + "@." + operator.displayvalue + " " + intOrString(dataType, valueList[index]);
                            if (index !== valueList.length - 1)
                                partialValueExpression = partialValueExpression + " || ";
                            else
                                break;
                        }
                        partialValueExpression = partialValueExpression + ")";
                        valueExpression = rule.parentKey + "[?(@.key=='" + rule.field + "' && " + partialValueExpression + ")]";
                        expression = valueExpression;

                        break;
                    case 'anamoly - 6 sigma':
                        expression = rule.parentKey + "[?(@.key" + operator.displayvalue + "'" + rule.field + "')]"
                        break;
                    default:
                        var value = rule.value === null ? '' : rule.value.replace(/\s+/g, '');
                        expression = rule.parentKey + "[?(@.key=='" + rule.field + "' && @." + operator.displayvalue + " " + intOrString(dataType, value) + ")]";
                        break;
                }

                returnJSON = {
                    key: "exp",
                    value: expression
                };
            }
            //console.log(expression);

            return returnJSON;
        }

        //returns operator map for setting up operators in queryBuilder
        function getOperatorMap() {
            return [ /* Event */
                {
                    type: 'equal',
                    optgroup: 'Comparison',
                    displayvalue: 'value==',
                    nb_inputs: 1,
                    multiple: false,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'not_equal',
                    optgroup: 'Comparison',
                    displayvalue: 'value!=',
                    nb_inputs: 1,
                    multiple: false,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'in',
                    optgroup: 'Comparison',
                    displayvalue: 'valuein',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime']
                },
                {
                    type: 'not_in',
                    optgroup: 'Comparison',
                    displayvalue: 'valuenot in',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime']
                },
                {
                    type: 'less',
                    optgroup: 'Comparison',
                    displayvalue: 'value<',
                    nb_inputs: 1,
                    multiple: false,
                    apply_to: ['number', 'datetime']
                },
                {
                    type: 'less_or_equal',
                    optgroup: 'Comparison',
                    displayvalue: 'value<=',
                    nb_inputs: 1,
                    multiple: false,
                    apply_to: ['number', 'datetime']
                },
                {
                    type: 'greater',
                    optgroup: 'Comparison',
                    displayvalue: 'value>',
                    nb_inputs: 1,
                    multiple: false,
                    apply_to: ['number', 'datetime']
                },
                {
                    type: 'greater_or_equal',
                    optgroup: 'Comparison',
                    displayvalue: 'value>=',
                    nb_inputs: 1,
                    multiple: false,
                    apply_to: ['number', 'datetime']
                },
                {
                    type: 'is_null',
                    optgroup: 'Comparison',
                    displayvalue: 'value==',
                    nb_inputs: 0,
                    multiple: false,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'is_not_null',
                    optgroup: 'Comparison',
                    displayvalue: 'value!=',
                    nb_inputs: 0,
                    multiple: false,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                /* Window */
                {
                    type: 'avg ==',
                    optgroup: 'Average',
                    displayvalue: 'avg==',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'avg !=',
                    optgroup: 'Average',
                    displayvalue: 'avg!=',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'avg <',
                    optgroup: 'Average',
                    displayvalue: 'avg<',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'avg <=',
                    optgroup: 'Average',
                    displayvalue: 'avg<=',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'avg >',
                    optgroup: 'Average',
                    displayvalue: 'avg>',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'avg >=',
                    optgroup: 'Average',
                    displayvalue: 'avg>=',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },

                {
                    type: 'min ==',
                    optgroup: 'Minimum',
                    displayvalue: 'min==',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'min !=',
                    optgroup: 'Minimum',
                    displayvalue: 'min!=',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'min <',
                    optgroup: 'Minimum',
                    displayvalue: 'min<',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'min <=',
                    optgroup: 'Minimum',
                    displayvalue: 'min<=',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'min >',
                    optgroup: 'Minimum',
                    displayvalue: 'min>',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'min >=',
                    optgroup: 'Minimum',
                    displayvalue: 'min>=',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },

                {
                    type: 'max ==',
                    optgroup: 'Maximum',
                    displayvalue: 'max==',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'max !=',
                    optgroup: 'Maximum',
                    displayvalue: 'max!=',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'max <',
                    optgroup: 'Maximum',
                    displayvalue: 'max<',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'max <=',
                    optgroup: 'Maximum',
                    displayvalue: 'max<=',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'max >',
                    optgroup: 'Maximum',
                    displayvalue: 'max>',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'max >=',
                    optgroup: 'Maximum',
                    displayvalue: 'max>=',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },

                {
                    type: 'count ==',
                    optgroup: 'Count',
                    displayvalue: 'count==',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'count !=',
                    optgroup: 'Count',
                    displayvalue: 'count!=',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'count <',
                    optgroup: 'Count',
                    displayvalue: 'count<',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'count <=',
                    optgroup: 'Count',
                    displayvalue: 'count<=',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'count >',
                    optgroup: 'Count',
                    displayvalue: 'count>',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },
                {
                    type: 'count >=',
                    optgroup: 'Count',
                    displayvalue: 'count>=',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime', 'boolean']
                },

                {
                    type: 'median ==',
                    optgroup: 'Median',
                    displayvalue: 'median==',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime']
                },
                {
                    type: 'median !=',
                    optgroup: 'Median',
                    displayvalue: 'median!=',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime']
                },
                {
                    type: 'median <',
                    optgroup: 'Median',
                    displayvalue: 'median<',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime']
                },
                {
                    type: 'median <=',
                    optgroup: 'Median',
                    displayvalue: 'median<=',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime']
                },
                {
                    type: 'median >',
                    optgroup: 'Median',
                    displayvalue: 'median>',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime']
                },
                {
                    type: 'median >=',
                    optgroup: 'Median',
                    displayvalue: 'median>=',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number', 'datetime']
                },

                {
                    type: 'mode in',
                    optgroup: 'Mode',
                    displayvalue: 'mode contains',
                    nb_inputs: 1,
                    multiple: true,
                    apply_to: ['string', 'number']
                },

                {
                    type: 'anamoly - 6 sigma',
                    optgroup: 'Built-in Model',
                    displayvalue: '6SIGMAAnomaly',
                    nb_inputs: 0,
                    multiple: true,
                    apply_to: ['string', 'number']
                }
            ];
        }

        //returns a 'filter' object mapped to it's operators and filtered by rule type and filter value type to be used in queryBuilder.
        function filterMapper(ruleType, template) {
            var filter = {
                id: template.id,
                label: template.id,
                type: 'string', //temporary override
                optgroup: template.parentKey,
                operators: [],
                size: 30
            }

            var filterOperators = [
                ['equal', 'not_equal', 'in', 'not_in', 'less', 'less_or_equal', 'greater', 'greater_or_equal',
                    'is_null', 'is_not_null', 'anamoly - 6 sigma'],
                ['equal', 'not_equal', 'is_null', 'is_not_null'],
                ['between', 'avg ==', 'avg !=', 'avg <', 'avg <=', 'avg >', 'avg >=', 'min ==', 'min !=', 'min <', 'min <=', 'min >', 'min >=', 'max ==', 'max !=', 'max <', 'max <=', 'max >', 'max >=', 'count ==', 'count !=', 'count <', 'count <=', 'count >', 'count >=', 'median ==', 'median !=', 'median <', 'median <=', 'median >=', 'median >=', 'mode in', 'anamoly - 6 sigma'],
                ['equal', 'not_equal', 'in', 'not_in', 'less', 'less_or_equal', 'greater', 'greater_or_equal',
                    'is_null', 'is_not_null']];

            if (ruleType === 'Event' || ruleType === 'Custom') {

                if (template.type === 'integer') {
                    if (template.parentKey == 'machineLearning' || template.parentKey == 'arithmetic')
                        filter.operators = filterOperators[3];
                    else
                        filter.operators = filterOperators[0];
                } else {
                    filter.operators = filterOperators[1];
                }

            } else if (ruleType === 'Window') {

                if (template.type === 'integer') {
                    if (template.parentKey == 'machineLearning' || template.parentKey == 'arithmetic')
                        filter.operators = filterOperators[3];
                    else
                        filter.operators = filterOperators[2];
                } else {
                    filter.operators = filterOperators[1];
                }
            }
            return filter;
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //Submit generated rule
        function submitRule(data) {
            return $http({
                method: 'POST',
                url: API + '/ruleBuilder/save',
                data: data
            })
        }

        // initialise batch rule data - message model and subdomains
        function initBatchRuleData() {
            return $http({
                url: API + "/iotBatchRule/initData",
                method: 'GET'
            });
        }

        //submit batch rule
        function submitBatchRule(data) {
            return $http({
                method: 'POST',
                url: API + '/iotBatchRule/invokeSparkJob',
                data: $httpParamSerializerJQLike({
                    messageMasterId: data.messageMasterId,
                    ruleText: JSON.stringify(data.ruleText)
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        }

        // get spark app id
        function getSparkAppId() {
            return $http({
                url: API + '/iotBatchRule/sparkAppId',
                method: 'GET'
            });
        }

        //get spark jobs data from app id and rest api: <host>:<port>/api/v1/applications/<appId>/jobs
        function getSparkJobsData(appId) {
            return $http({
                url: API + "/iotBatchRule/sparkJobsData",
                method: 'POST',
                data: $httpParamSerializerJQLike({
                    "appId": appId
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        }

        
    }
})();