const path = require('path');

module.exports = {
  prefix: 'rc-widget',
  brandConfig: {
    id: '3420',
    code: 'att',
    name: 'Office@Hand',
    appName: 'Office@Hand Embeddable',
    fullName: 'Office@Hand',
    application: 'Office@Hand Embeddable',
    allowRegionSettings: true,
    defaultLocale: 'en-US',
    supportedLocales: [
      'en-US',
      'en-GB',
      'en-AU',
      'fr-FR',
      'fr-CA',
      'de-DE',
      'it-IT',
      'es-ES',
      'es-419',
      'ja-JP',
      'pt-PT',
      'pt-BR',
      'zh-CN',
      'zh-TW',
      'zh-HK',
      'nl-NL',
      'ko-KR',
    ],
    callWithJupiter: {
      link: 'https://app.officeathand.att.com/',
      protocol: 'officeathand://',
      name: 'Office@Hand App',
    },
    isDisableSpartan: true,
    allowJupiterUniversalLink: true,
    callWithSoftphone: {
      protocol: 'attvr20://',
      name: 'Office@Hand Phone',
      appDownloadUrl: {
        mac: 'https://www.ringcentral.com/apps/officeathand-mac',
        windows: 'https://www.ringcentral.com/apps/officeathand-windows',
      },
    },
    rcmProductName: 'AT&T Office@Hand Meeting',
    rcvProductName: 'AT&T Office@Hand Meetings',
    rcvMeetingTopic: "{extensionName}'s {brandName} Meetings",
    rcvSettingsTitle: '{brandName} Meetings settings',
    rcvTeleconference: 'https://meetings.officeathand.att.com/teleconference',
    rcvInviteMeetingContent:
      '{accountName} has invited you to a {rcvProductName} meeting.\n\nPlease join using this link:\n    {joinUri}{passwordTpl}',
    teleconference: 'https://meetings-officeathand.att.com/teleconference',
    eulaLink: 'http://www.att.com/officeathandpolicy',
    assets: {
      logo: '/assets/att/logo.svg',
      icon: '/assets/att/icon.svg',
    },
    showFeedback: false,
    subBrands: [{ id: '3460', code: 'attub' }],
    enableEDP: true,
  },
  brandFolder: __dirname,
  assetsFolder: path.resolve(__dirname, '../../src/assets/att'),
};