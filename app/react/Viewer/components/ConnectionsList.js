import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fromJS as Immutable} from 'immutable';
import {I18NLink} from 'app/I18N';
import {NeedAuthorization} from 'app/Auth';

import ShowIf from 'app/App/ShowIf';
import {deleteReference} from 'app/Viewer/actions/referencesActions';
import {highlightReference, closePanel, activateReference, selectReference, deactivateReference} from 'app/Viewer/actions/uiActions';
import {Item} from 'app/Layout';
import {createSelector} from 'reselect';

import 'app/Viewer/scss/viewReferencesPanel.scss';

export class ConnectionsList extends Component {

  relationType(id, relationTypes) {
    let type = relationTypes.find((relation) => relation._id === id);
    if (type) {
      return type.name;
    }
  }

  close() {
    this.props.closePanel();
    this.props.deactivateReference();
  }

  clickReference(reference) {
    if (!this.props.targetDoc) {
      this.props.activateReference(reference, this.props.doc.pdfInfo, this.props.referencesSection);
    }
    if (this.props.targetDoc && typeof reference.range.start !== 'undefined') {
      this.props.selectReference(reference, this.props.doc.pdfInfo);
    }
  }

  deleteReference(reference) {
    this.context.confirm({
      accept: () => {
        this.props.deleteReference(reference);
      },
      title: 'Confirm delete connection',
      message: 'Are you sure you want to delete this connection?'
    });
  }

  render() {
    const uiState = this.props.uiState.toJS();
    const relationTypes = this.props.relationTypes.toJS();
    const useSourceTargetIcons = typeof this.props.useSourceTargetIcons !== 'undefined' ? this.props.useSourceTargetIcons : true;

    const references = this.props.references.toJS().sort((a, b) => {
      let aStart = typeof a.range.start !== 'undefined' ? a.range.start : -1;
      let bStart = typeof b.range.start !== 'undefined' ? b.range.start : -1;
      return aStart - bStart;
    });

    if (this.props.loading) {
      return false;
    }

    return (
      <div className="item-group">
        <div className="sort-by">
          <div className="Dropdown order-by u-floatRight ">
            <span className="Dropdown-label">Group by</span>
            <ul className="Dropdown-list">
              <li className="Dropdown-option is-active">Connection type</li>
            </ul>
            <i className="order-by-arrow fa fa-long-arrow-down"></i>
          </div>
        </div>
        <button className="item-group-header is-expanded">
          <div className="title">
            <span className="itemGroup-title">
              <span className="item-type item-type-empty item-type--mini">
                <span className="item-type__name">
                  <i className="fa fa-arrows-h"></i>
                </span>
              </span>
              <span>Articulo violado</span>
            </span>
            <span className="multiselectItem-results">
              <span className="multiselectItem-action"><i className="fa fa-caret-down"></i></span>
            </span>
          </div>
        </button>
        <div className="item">
          <div className="item-info">
            <span className="item-name">
              <span className="item-type item-type-1 item-type--mini">
                <span className="item-type__name"><i className="fa fa-file-text-o"></i></span>
              </span>
              Convención Interamericana DH
            </span>
            <div className="item-snippet well">
              2. El peticionario alega que la referida sentencia viola los artículos 1, 2, 4, 5, 8, 11(2), 17, 24, 25,  26  y  32  de  la  Convención  Americana  sobre  Derechos  Humanos  (en adelante  “la Convención” o “la Convención Americana”), así como los artículos 3, 10 y 15 del Protocolo Adicional  a  la  Convención  Americana  sobre  Derechos  Humanos  en  materia  de  Derechos
              <a href="#">View document</a>
              <span className="button-toggle">
                <i className="fa fa-caret-down"></i>
              </span>
            </div>
            <div className="item-actions"><span>Referenced in <a href="#">page 1</a>, <a href="#">page 4</a></span></div>
          </div>
        </div>
        {/*
        {(() => {
          return references.map((reference, index) => {
            let itemClass = '';
            let disabled = this.props.targetDoc && typeof reference.range.start === 'undefined';
            let referenceIcon = reference.inbound ? 'fa-sign-in' : 'fa-sign-out';

            if (uiState.highlightedReference === reference._id) {
              itemClass = 'relationship-hover';
            }

            if (uiState.activeReference === reference._id) {
              itemClass = 'relationship-active';
              if (this.props.targetDoc && this.props.uiState.toJS().reference.targetRange) {
                itemClass = 'relationship-selected';
              }
            }

            const doc = Immutable({
              sharedId: reference.connectedDocument,
              type: reference.connectedDocumentType,
              title: reference.connectedDocumentTitle,
              icon: reference.connectedDocumentIcon,
              template: reference.connectedDocumentTemplate,
              metadata: reference.connectedDocumentMetadata,
              creationDate: reference.connectedDocumentCreationDate,
              published: reference.connectedDocumentPublished
            });

            return (
              <Item
                key={index}
                onMouseEnter={this.props.highlightReference.bind(null, reference._id)}
                onMouseLeave={this.props.highlightReference.bind(null, null)}
                onClick={this.clickReference.bind(this, reference)}
                doc={doc}
                className={`${itemClass} item-${reference._id} ${disabled ? 'disabled' : ''}`}
                data-id={reference._id}
                additionalIcon={<ShowIf if={useSourceTargetIcons}>
                                  <span><i className={`fa ${referenceIcon}`}></i>&nbsp;</span>
                                </ShowIf>}
                additionalText={reference.text}
                additionalMetadata={[
                  {label: 'Connection type', value: this.relationType(reference.relationType, relationTypes)}
                ]}
                evalPublished={true}
                buttons={
                  <div className="item-shortcut-group">
                    <ShowIf if={!this.props.targetDoc}>
                      <NeedAuthorization>
                        <a className="item-shortcut item-shortcut--danger" onClick={this.deleteReference.bind(this, reference)}>
                          <i className="fa fa-trash"></i>
                        </a>
                      </NeedAuthorization>
                    </ShowIf>
                    &nbsp;
                    <ShowIf if={!this.props.targetDoc}>
                      <I18NLink to={`/${doc.get('type')}/${doc.get('sharedId')}`}
                            onClick={e => e.stopPropagation()}
                            className="item-shortcut">
                        <span className="itemShortcut-arrow">
                          <i className="fa fa-file-text-o"></i>
                        </span>
                      </I18NLink>
                    </ShowIf>
                  </div>
                }
              />
            );
          });
        })()}
        */}
      </div>
    );
  }
}

ConnectionsList.propTypes = {
  uiState: PropTypes.object,
  doc: PropTypes.object,
  references: PropTypes.object,
  referencedDocuments: PropTypes.object,
  relationTypes: PropTypes.object,
  highlightReference: PropTypes.func,
  activateReference: PropTypes.func,
  selectReference: PropTypes.func,
  deactivateReference: PropTypes.func,
  closePanel: PropTypes.func,
  deleteReference: PropTypes.func,
  targetDoc: PropTypes.bool,
  loading: PropTypes.bool,
  referencesSection: PropTypes.string,
  useSourceTargetIcons: PropTypes.bool
};

ConnectionsList.contextTypes = {
  confirm: PropTypes.func
};

const selectDoc = createSelector(
  s => s.documentViewer.targetDoc,
  s => s.documentViewer.doc,
  (targetDoc, doc) => targetDoc.get('_id') ? targetDoc.toJS() : doc.toJS()
);

const mapStateToProps = (state) => {
  const {documentViewer} = state;
  return {
    uiState: documentViewer.uiState,
    relationTypes: documentViewer.relationTypes,
    targetDoc: !!documentViewer.targetDoc.get('_id'),
    doc: selectDoc(state)
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({highlightReference, closePanel, activateReference, selectReference, deactivateReference, deleteReference}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionsList);
