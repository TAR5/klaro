import React from 'react'
import ConsentModal from './consent-modal'
import {getPurposes} from 'utils/config'

export default class ConsentNotice extends React.Component {

    // static getDerivedStateFromProps(props) {
    //     return props.show
    //         ? {modal : undefined}
    //         : {}
    // }

    // The modal wouldn't close when the new code above was used.
    // eslint-disable-next-line react/no-deprecated
    componentWillReceiveProps(props){
        if (props.show)
            this.setState({modal : undefined})
    }

    showModal = () => {
        this.setState({modal: true})
    }

    hide = () => {
        this.setState({modal: false})
    }

    executeButtonClicked = (setChangedAll, changedAllValue) => {
        if (setChangedAll)
            this.props.manager.changeAll(changedAllValue)
        this.props.manager.saveAndApplyConsents()
        this.setState({modal: false})
    }

    saveAndHide = () => {
        this.executeButtonClicked(false, false)
    }

    acceptAndHide = () => {
        this.executeButtonClicked(true, true)
    }

    declineAndHide = () => {
        this.executeButtonClicked(true, false)
    }

    render(){
        const {modal} = this.state
        const {config, manager, show, t} = this.props

        const purposes = getPurposes(config)
        const purposesText = purposes.map((purpose) => t(['purposes', purpose])).join(", ")

        let changesText

        if (manager.changed)
            changesText = <p className="cn-changes">{t(['consentNotice', 'changeDescription'])}</p>

        if (manager.confirmed && !show)
            return <div />

        const declineButton = config.hideDeclineAll ?
            ''
            :
            <button className="cm-btn cm-btn-sm cm-btn-danger cn-decline" type="button" onClick={this.declineAndHide}>{t(['decline'])}</button>

        const acceptButton = config.acceptAll ?
            <button className="cm-btn cm-btn-sm cm-btn-success" type="button" onClick={this.acceptAndHide}>{t(['acceptAll'])}</button>
            :
            <button className="cm-btn cm-btn-sm cm-btn-success" type="button" onClick={this.saveAndHide}>{t(['ok'])}</button>

        const noticeIsVisible =
            !config.mustConsent && !manager.confirmed && !config.noNotice

        if (modal || (show && modal === undefined) || (config.mustConsent && !manager.confirmed))
            return <ConsentModal t={t} config={config} hide={this.hide} declineAndHide={this.declineAndHide} saveAndHide={this.saveAndHide} acceptAndHide={this.acceptAndHide} manager={manager} />
        return <div className={`cookie-notice ${!noticeIsVisible ? 'cookie-notice-hidden' : ''}`}>
            <div className="cn-body">
                <p>
                    {t(['consentNotice', 'description'], {purposes: <strong>{purposesText}</strong>})}
                </p>
                {changesText}
                <p className="cn-ok">
                    <button className="cm-btn cm-btn-info" type="button" onClick={this.showModal}>{t(['consentNotice', 'learnMore'])}</button>
                    {declineButton}
                    {acceptButton}
                </p>
            </div>
        </div>
    }
}
