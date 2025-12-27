const http = require('http');

const STRAPI_URL = 'http://localhost:1337';

const alumniData = [
  {
    fullName: 'Pedro Henrique',
    displayName: 'Pedro Henrique',
    slug: 'pedro-henrique',
    email: 'pedro@ufam.edu.br',
    phone: '+5592999999',
    position: 'Professor',
    isActive: true,
    displayOrder: 6,
    degree: 'Doutor',
    degreeLevel: 'Doutorado',
    graduation: '2021',
    graduationYear: 2021,
    defenseYear: '2021',
    defenseTitle: 'Controle Avançado',
    currentCompany: 'UFAM',
  },
];

const data = { data: alumniData[0] };

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(`${STRAPI_URL}/api/alumni`, options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => (responseData += chunk));

  res.on('end', () => {
    try {
      const result = JSON.parse(responseData);
      console.log('✅ Alumni criado:', result);
    } catch (e) {
      console.error('❌ Erro:', e.message);
    }
  });

  res.on('error', (err) => {
    console.error('❌ Erro HTTP:', err.message);
  });
});

req.write(JSON.stringify(data));
req.end();
