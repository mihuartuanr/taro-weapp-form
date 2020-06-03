import Taro, { Component } from '@tarojs/taro'
import cname from 'classnames'
import { View, Text, Image, Video, Textarea } from '@tarojs/components'

import './index.scss'

// 校验规则参考：https://github.com/yiminghe/async-validator或ElementUI的规则
export default class Index extends Component {
  static options = {
    styleIsolation: "apply-shared"
  }
  static defaultProps = {
    className: '',
    buttonText: '',
    fieldMetas: [
      {}
    ],
    fieldValues: {},
    onSubmit: () => {}
  }
  constructor(props) {
    super(props)
  }
  state = {
    validateErrors: {},
  };
  refFormItem = (node, idx) => {
    if(this.formItem) {
      !this.formItem.includes(node) && this.formItem.push(node)
    } else {
      this.formItem = [node]
    }
  }

  componentWillMount () {
   }

  componentDidMount () {
    this.validateField();
  }

  componentWillUnmount () { }

  componentDidShow () {
  }

  componentDidHide () { }
  config = {
    usingComponents: {
      "form-item": "./form-item/index",
    }
  }
  componentWillUpdate(newProps, newState) {}
  findValue (key) {
    const { fieldValues } = this.props;
    return fieldValues[key] || '';
  }
  gatherValidate (error) {
    if (error === true) return;
    const { detail: { field, message } } = error;
    let { validateErrors } = this.state;
    if (message) {
      validateErrors = {
        ...validateErrors,
        [field]: message
      }
    } else {
      delete validateErrors[field];
    }
    this.state.validateErrors = {...validateErrors} // setState异步，连续调用gatherValidate，this.state.validateErrors来不及更新；
    this.setState({
      validateErrors: {...validateErrors}
    })
  }
  clearValidate () {
    this.formItem.forEach(item => {
      item.clearValidate()
    })
  }
  validateField () {
    (this.formItem || []).forEach(async (item) => {
      const {data: {metas}} = item;
      this.gatherValidate(await item.onValidate({}, metas.rules))
    })
  }
  submitForm ({ detail={} }) {
    const {validateErrors} = this.state;
    const { value } = detail;
    if(Object.keys(validateErrors).length) return;
    this.props.onSubmit(value)
  }
  render () {
    const { fieldMetas, buttonText, className } = this.props;
    const {validateErrors} = this.state;
    return (
      <Form className='form' onSubmit={this.submitForm.bind(this)}>
        <View className={`form-wrap__inner ${className}`}>
          {
            fieldMetas.map((meta, idx) => {
              return (
                <form-item
                  ref={this.refFormItem}
                  onValidate={this.gatherValidate.bind(this)}
                  taroKey={meta.name}
                  metas={meta}
                  initialValue={this.findValue.call(this, meta.name)}
                >
                </form-item>
              )
            })
          }
          <Slot />
        </View>
        <View className="btns-wrap">
          <Button className={cname('btn', 'btn-confirm', {'btn-disabled': Object.keys(validateErrors).length})} form-type="submit">{buttonText || '按钮'}</Button>
        </View>
      </Form>
    )
  }
}
