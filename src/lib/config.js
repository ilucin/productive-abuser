let ENV = 'development';

if (typeof window !== 'undefined') {
  ENV = window.ENV || 'development';
}

const development = {
  realtimeHost: 'http://localhost:3000',
  apiHost: 'http://api.productive.io.dev',
  // token: '3b0c6139-8be0-422c-b4d2-ec2979aa3da9',
  token: '3fd23548-1605-4202-a6f1-c0580fd927d2',
  projectId: '102',
  organizationId: '16',
  presenterPersonId: '91',
  foodServiceId: '251'
};

const production = {
  realtimeHost: 'https://realtime.productive.io',
  apiHost: 'https://api.productive.io',
  token: '',
  personId: '13892',
  projectId: '23',
  organizationId: '1',
  presenterPersonId: '99',
  foodServiceId: '251'
};

export default Object.assign({}, ENV === 'development' ? development : production);
