import AsyncValidator from "async-validator";
import {analysisValidate} from '../../../utils/validators';
import {capitalFirstLetter} from '../../../utils/formatter';

Component({
  behaviors: ['wx://form-field-group'],
  options: {
    styleIsolation: "apply-shared"
  },
  properties: {
    metas: {
      type: Object,
      value: {
        type: 'text',
        label: '',
        rules: [],
      }
    },
    initialValue: {
      type: [Object, String],
      value: ''
    }
  },
  data: {
    changeValidate: '',
    inputValidate: '',
    blurValidate: '',
    rules: '',
    value: '',
    isFocus: false,
    isRequired: false,
    validateState: '', //['validating', 'success', 'error']
    validateMessage: ''
  },
  observers: {
    initialValue (newV) {
      this.setData({
        value: newV
      })
    },
    metas(newV){
      this.setData({
        rules: analysisValidate(newV.rules || [])
      })
    },
    rules(newV) {
      const keys = [...(newV || {}).keys()];
      keys.forEach(key => {
        this.setData({
          [`${key}Validate`]: `on${capitalFirstLetter(key)}Validate`
        })
      })
    }
  },
  methods: {
    async afterUpload ({ detail= {} }) {
      const { file } = detail;
      const { metas: { name: key } } = this.data;
      try {
        this.setData({
          value: file.path
        })
        this.data.rules.get('change') && this.onValidate({
          type: 'change',
          detail: {
            value: file.path
          }
        }, this.data.rules.get('change'))
      } catch (e) {
        console.error('上传头像发生错误')
      }
    },
    getFocus (e) {
      this.setData({
        isFocus: true,
      }, () => {
        this.clearValidate();
      })
    },
    blurEle (e) {
      // {{blurValidate}}
      this.setData({
        isFocus: false,
      })
      this.data.blurValidate && this.onBlurValidate(e);
    },
    changeValue (e) {
      const {detail = {}} = e;
      const {value} = detail;
      this.setData({
        value,
      })
      this.data.changeValidate && this.onChangeValidate(e);
    },
    onBlurValidate (e) {
      this.onValidate(e, this.data.rules.get('blur'))
    },
    onInputValidate (e) {
      this.onValidate(e, this.data.rules.get('input'))
    },
    onChangeValidate (e) {
      this.onValidate(e, this.data.rules.get('change'))
    },
    async onValidate({ type, detail= {} }, rules = []) {
      const { metas: { name: key } } = this.data;
      if ((!rules || rules.length === 0)) {
        return true;
      }
      this.validateState = 'validating';

      const descriptor = {};
      descriptor[key] = rules;
      // // 验证规则AsyncValidator实例对象
      const validator = new AsyncValidator(descriptor);
      const model = {};
      // // AsyncValidator需要的验证数据
      model[key] = detail.value || this.data.value;
      // // 验证
      try {
        await validator.validate(model, { firstFields: true })
        if (type) {
          this.setData({
            validateState: 'success',
            validateMessage: '',
          })
          this.triggerEvent('validate', {
            field: key,
            message: null
          })
        } else {
          return {
            detail: {
              field: key,
              message: null
            }
          }
        }
      } catch ({ errors, invalidFields }) {
        // null null正确的时候
        if (type) {
          //事件触发
          this.setData({
            validateState: 'error',
            validateMessage: errors[0].message,
          })
          // // 执行回调
          // callback(this.validateMessage, invalidFields);
          // // form组件发布validate事件
          // this.elForm && this.elForm.$emit('validate', this.prop, !errors);
          this.triggerEvent('validate', errors[0])
        } else {
          // 表单初始化
          return {
            detail: errors[0]
          }
        }
      }
      // return validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
      //   // null null正确的时候
      //   if (type) {
      //     //事件触发
      //     this.setData({
      //       validateState: !errors ? 'success' : 'error',
      //       validateMessage: errors ? errors[0].message : '',
      //     })
      //     // // 执行回调
      //     // callback(this.validateMessage, invalidFields);
      //     // // form组件发布validate事件
      //     // this.elForm && this.elForm.$emit('validate', this.prop, !errors);
      //     this.triggerEvent('validate', errors
      //     ? errors[0]
      //     : {
      //         field: key,
      //         message: null
      //       }
      //     )
      //   } else {
      //     // 表单初始化
      //     return errors
      //     ? {
      //       detail: errors[0]
      //     }
      //     : {
      //       detail: {
      //         field: key,
      //         message: null
      //       }
      //     }
      //   }
      // });
    },
    clearValidate() {
      const { metas: { name: key } } = this.data;
      // // 验证状态
      // this.validateState = '';
      // // 验证message
      // this.validateMessage = '';
      // this.validateDisabled = false;
      this.setData({
        validateState: '',
        validateMessage: ''
      });
      this.triggerEvent('validate', {
        field: key,
        message: null
      })
    },
    resetField() {
      this.setData({
        value: this.data.initialValue
      });
      this.clearValidate();
    }
  }
})
