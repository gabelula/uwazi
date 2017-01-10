import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {DropTarget} from 'react-dnd';
import {Form} from 'react-redux-form';
import {FormField} from 'app/Forms';
import {I18NLink} from 'app/I18N';
import {actions as formActions} from 'react-redux-form';

import {inserted, addProperty} from 'app/Templates/actions/templateActions';
import MetadataProperty from 'app/Templates/components/MetadataProperty';
import RemovePropertyConfirm from 'app/Templates/components/RemovePropertyConfirm';
import validator from './ValidateTemplate';

export class MetadataTemplate extends Component {

  render() {
    const {connectDropTarget, formState} = this.props;
    let nameGroupClass = 'template-name form-group';
    if (formState.fields.name && !formState.fields.name.valid && (formState.submitFailed || formState.fields.name.dirty)) {
      nameGroupClass += ' has-error';
    }

    return <div>
            <RemovePropertyConfirm />
            <Form
              model="template.data"
              onSubmit={this.props.saveTemplate}
              className="metadataTemplate panel-default panel"
              validators={validator(this.props.template.properties, this.props.templates.toJS(), this.props.template._id)}
            >
              <div className="metadataTemplate-heading panel-heading">
                <I18NLink to={this.props.backUrl} className="btn btn-default"><i className="fa fa-arrow-left"></i> Back</I18NLink>
                &nbsp;
                <div className={nameGroupClass}>
                  <FormField model="template.data.name">
                    <input placeholder="Template name" className="form-control"/>
                  </FormField>
                  {(() => {
                    if (this.props.formState.fields.name &&
                        this.props.formState.fields.name.dirty &&
                        this.props.formState.fields.name.errors.duplicated) {
                      return <div className="validation-error">
                                <i className="fa fa-exclamation-triangle"></i>
                                &nbsp;
                                Duplicated name
                            </div>;
                    }
                  })()}
                </div>
                &nbsp;
                <button type="submit" className="btn btn-success save-template" disabled={!!this.props.savingTemplate}>
                  <i className="fa fa-save"/> Save
                </button>
              </div>

              {connectDropTarget(
                <ul className="metadataTemplate-list list-group">
                  <li className="list-group-item">
                    <span className="property-name">
                      <i className="fa fa-font"></i> Title
                    </span>
                    <div className="list-group-item-actions">
                      <button type="button" className="btn btn-default btn-xs property-edit">
                        <i className="fa fa-pencil"></i> Edit
                      </button>
                      <button type="button" disabled className="btn btn-danger btn-xs property-remove">
                        <i className="fa fa-trash"></i> Delete
                      </button>
                    </div>
                    <div className="propery-form expand">
                      <div>
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="input-group">
                              <span className="input-group-addon">
                                Label
                              </span>
                              <FormField model="">
                                <input className="form-control" />
                              </FormField>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-4">
                            <div className="input-group">
                              <span className="input-group-addon">
                                <FormField>
                                  <input type="checkbox" checked disabled/>
                                </FormField>
                              </span>
                              <label className="form-control">Required</label>
                            </div>
                          </div>
                          <div className="col-sm-8">
                            <div className="input-group">
                              <span className="input-group-addon">
                                <FormField>
                                  <input type="checkbox"/>
                                </FormField>
                              </span>
                              <label className="form-control"
                                     title="This will activate an option to display one icon or flag before the title.">
                                Display title with an icon or flag
                                &nbsp;
                                <i className="fa fa-question-circle"></i>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <span className="property-name">
                      <i className="fa fa-calendar"></i> Date added
                    </span>
                    <div className="list-group-item-actions">
                      <button type="button" className="btn btn-default btn-xs property-edit">
                        <i className="fa fa-pencil"></i> Edit
                      </button>
                      <button type="button" disabled className="btn btn-danger btn-xs property-remove">
                        <i className="fa fa-trash"></i> Delete
                      </button>
                    </div>
                    <div className="propery-form expand">
                      <div>
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="input-group">
                              <span className="input-group-addon">
                                Label
                              </span>
                              <FormField model="">
                                <input className="form-control" />
                              </FormField>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-4">
                            <div className="input-group">
                              <span className="input-group-addon">
                                <FormField>
                                  <input type="checkbox" checked disabled/>
                                </FormField>
                              </span>
                              <label className="form-control">Required</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  {this.props.template.properties.map((config, index) => {
                    return <MetadataProperty {...config} key={config.localID} index={index}/>;
                  })}
                  <div className="no-properties">
                    <span className="no-properties-wrap">
                      <i className="fa fa-clone"></i>Drag custom properties here
                    </span>
                 </div>
                </ul>
              )}

            </Form>
          </div>;
  }
}

MetadataTemplate.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  formState: PropTypes.object,
  backUrl: PropTypes.string,
  saveTemplate: PropTypes.func,
  savingTemplate: PropTypes.bool,
  setErrors: PropTypes.func,
  template: PropTypes.object,
  templates: PropTypes.object
};

const target = {
  canDrop() {
    return true;
  },

  drop(props, monitor) {
    let item = monitor.getItem();

    let propertyAlreadyAdded = props.template.properties[item.index];

    if (propertyAlreadyAdded) {
      props.inserted(item.index);
      return;
    }

    props.addProperty({label: item.label, type: item.type}, props.template.properties.length);
    return {name: 'container'};
  }
};

let dropTarget = DropTarget('METADATA_OPTION', target, (connector) => ({
  connectDropTarget: connector.dropTarget()
}))(MetadataTemplate);

export {dropTarget};

const mapStateToProps = (state) => {
  return {
    template: state.template.data,
    templates: state.templates,
    savingTemplate: state.template.uiState.get('savingTemplate'),
    formState: state.template.formState
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({inserted, addProperty, setErrors: formActions.setErrors}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(dropTarget);
