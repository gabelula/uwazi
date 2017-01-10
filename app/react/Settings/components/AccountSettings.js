import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from 'app/BasicReducer';

import UsersAPI from 'app/Users/UsersAPI';
import {notify} from 'app/Notifications/actions/notificationsActions';
import {t} from 'app/I18N';


export class AccountSettings extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {email: props.user.email, password: '', repeatPassword: ''};
  }

  componentWillReceiveProps(props) {
    this.setState({email: props.user.email});
  }

  emailChange(e) {
    this.setState({email: e.target.value});
  }

  passwordChange(e) {
    this.setState({password: e.target.value});
    this.setState({passwordError: false});
  }

  repeatPasswordChange(e) {
    this.setState({repeatPassword: e.target.value});
    this.setState({passwordError: false});
  }

  updateEmail(e) {
    e.preventDefault();
    let userData = Object.assign({}, this.props.user, {email: this.state.email});
    UsersAPI.save(userData)
    .then((result) => {
      this.props.notify(t('Email updated'), 'success');
      this.props.setUser(Object.assign(userData, {_rev: result.rev}));
    });
  }

  updatePassword(e) {
    e.preventDefault();
    let passwordsDontMatch = this.state.password !== this.state.repeatPassword;
    let emptyPassword = this.state.password.trim() === '';
    if (emptyPassword || passwordsDontMatch) {
      this.setState({passwordError: true});
      return;
    }

    UsersAPI.save(Object.assign({}, this.props.user, {password: this.state.password}))
    .then((result) => {
      this.props.notify(t('Password updated'), 'success');
      this.props.setUser(Object.assign(this.props.user, {_rev: result.rev}));
    });
    this.setState({password: '', repeatPassword: ''});
  }

  render() {
    return (
      <div className="account-settings">
        <div className="panel panel-default">
          <div className="panel-heading">
            <span>{t('System', 'Collection settings')}</span>
            <button type="submit" className="btn btn-success pull-right"><i className="fa fa-save"></i> {t('System', 'Save')}</button>
          </div>
          <div className="panel-body">
            <form onSubmit={this.updateEmail.bind(this)}>
              <div className="form-group">
                <label htmlFor="collection_name">{t('System', 'Name')}</label>
                <input onChange="" value="Uwazi" type="text" className="form-control"/>
                <p className="form-group-description">The name of your Uwazi collection.</p>
              </div>
              <div className="form-group">
                <label htmlFor="collection_name">{t('System', 'Home page')}</label>
                <div className="input-group">
                  <span className="input-group-addon">http://localhost:3000/</span>  
                  <input onChange="" type="text" className="form-control"/>
                </div>
                <p className="form-group-description">Set your Uwazi first page. It will be the library by default.</p>
              </div>
              <div className="form-group">
                <label htmlFor="collection_name">{t('System', 'Email')}</label>
                <input type="email" onChange={this.emailChange.bind(this)} value={this.state.email} className="form-control"/>
                <p className="form-group-description">This e-mail will be used for admin purposes and Uwazi support.</p>
              </div>
            </form>
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <span>{t('System', 'Change password')}</span>
            <button type="submit" className="btn btn-success pull-right">
              <i className="fa fa-save"></i> {t('System', 'Save')}
            </button>
          </div>
          <div className="panel-body">
            <form onSubmit={this.updatePassword.bind(this)}>
              <div className={'form-group' + (this.state.passwordError ? ' has-error' : '')}>
                <label htmlFor="password">{t('System', 'New password')}</label>
                <input
                  type="password"
                  onChange={this.passwordChange.bind(this)}
                  value={this.state.password}
                  id="password"
                  className="form-control"/>
              </div>
              <div className={'form-group' + (this.state.passwordError ? ' has-error' : '')}>
                <label htmlFor="repeatPassword">{t('System', 'Confirm new password')}</label>
                <input
                  type="password"
                  onChange={this.repeatPasswordChange.bind(this)}
                  value={this.state.repeatPassword}
                  id="repeatPassword"
                  className="form-control"/>
              </div>
              {(() => {
                if (this.state.passwordError) {
                  return <div className="validation-error validation-error-centered">
                            <i className="fa fa-exclamation-triangle"></i>
                            &nbsp;
                            {t('System', 'bothFieldsRequired', 'Both fields are required and should match.')}
                        </div>;
                }
              })()}
            </form>
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <span>{t('System', 'Close admin session')}</span>
            <a href='/logout' className="btn btn-danger pull-right"><i className="fa fa-sign-out"></i><span> {t('System', 'Logout')}</span></a>
          </div>
        </div>
      </div>
    );
  }
}

AccountSettings.propTypes = {
  user: PropTypes.object,
  notify: PropTypes.func,
  setUser: PropTypes.func
};

export function mapStateToProps(state) {
  return {user: state.user.toJS()};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setUser: actions.set.bind(null, 'auth/user'), notify}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
