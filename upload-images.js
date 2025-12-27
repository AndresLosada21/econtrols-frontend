const https = require('https');
const http = require('http');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN =
  '8e2c5115e8b3a92387b0300acef3097a0aef0c19cf992d8bce13365c5630460e26749d11a265acb196799e1cd927237fd00df487beb5d3bcaed4d8fa327346e1492904379aad8ffe7b029e8021ae106cbdcc7ca5092c7c4ad9e9004dd1bfa929369768a7dea467faa7a4915cad57d3979da9d8aa7e2dd63b6cb91c15ec9fca5f';

// Faculty members data with placeholder images
const facultyMembers = [
  {
    id: 1,
    photoUrl: 'https://ui-avatars.com/api/?name=Iury+Bessa&background=4A90E2&color=fff&size=256',
  },
  {
    id: 2,
    photoUrl: 'https://ui-avatars.com/api/?name=Renan+Landau&background=E2A04A&color=fff&size=256',
  },
  {
    id: 3,
    photoUrl:
      'https://ui-avatars.com/api/?name=Vicente+Lucena&background=4AE2A0&color=fff&size=256',
  },
  {
    id: 4,
    photoUrl:
      'https://ui-avatars.com/api/?name=Alessandro+Trindade&background=4A90E2&color=fff&size=256',
  },
  {
    id: 5,
    photoUrl:
      'https://ui-avatars.com/api/?name=Florindo+Ayres&background=E2A04A&color=fff&size=256',
  },
  {
    id: 6,
    photoUrl: 'https://ui-avatars.com/api/?name=Joao+Aranha&background=4AE2A0&color=fff&size=256',
  },
  {
    id: 7,
    photoUrl: 'https://ui-avatars.com/api/?name=Joao+Chaves&background=4A90E2&color=fff&size=256',
  },
  {
    id: 8,
    photoUrl: 'https://ui-avatars.com/api/?name=Kenny+Santos&background=E2A04A&color=fff&size=256',
  },
  {
    id: 9,
    photoUrl:
      'https://ui-avatars.com/api/?name=Lucas+Cordeiro&background=4AE2A0&color=fff&size=256',
  },
  {
    id: 10,
    photoUrl: 'https://ui-avatars.com/api/?name=Luiz+Cordovil&background=4A90E2&color=fff&size=256',
  },
  {
    id: 11,
    photoUrl: 'https://ui-avatars.com/api/?name=Luiz+Sales&background=E2A04A&color=fff&size=256',
  },
  {
    id: 12,
    photoUrl: 'https://ui-avatars.com/api/?name=Ozenir+Farah&background=4AE2A0&color=fff&size=256',
  },
  {
    id: 13,
    photoUrl:
      'https://ui-avatars.com/api/?name=Pedro+Coutinho&background=4A90E2&color=fff&size=256',
  },
  {
    id: 14,
    photoUrl:
      'https://ui-avatars.com/api/?name=Rafael+Mendonca&background=E2A04A&color=fff&size=256',
  },
  {
    id: 15,
    photoUrl:
      'https://ui-avatars.com/api/?name=Rodrigo+Araujo&background=4AE2A0&color=fff&size=256',
  },
  {
    id: 16,
    photoUrl:
      'https://ui-avatars.com/api/?name=Romulo+Rodrigues&background=4A90E2&color=fff&size=256',
  },
  {
    id: 17,
    photoUrl:
      'https://ui-avatars.com/api/?name=Vicente+Lucena+Jr&background=4AE2A0&color=fff&size=256',
  },
];

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => resolve());
        file.on('error', (err) => reject(err));
      })
      .on('error', (err) => reject(err));
  });
}

async function uploadImage(filepath) {
  const formData = new FormData();
  formData.append('files', fs.createReadStream(filepath));

  return new Promise((resolve, reject) => {
    const req = http.request(
      `${STRAPI_URL}/api/upload`,
      {
        method: 'POST',
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${API_TOKEN}`,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    req.on('error', reject);
    formData.pipe(req);
  });
}

async function updateFacultyPhoto(id, fileId) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      data: { photo: fileId },
    });

    const req = http.request(
      `${STRAPI_URL}/api/faculty-members/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          Authorization: `Bearer ${API_TOKEN}`,
        },
      },
      (res) => {
        let responseData = '';
        res.on('data', (chunk) => (responseData += chunk));
        res.on('end', () => {
          try {
            const result = JSON.parse(responseData);
            resolve(result);
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function processFacultyMember(member) {
  try {
    console.log(`Processing faculty member ${member.id}...`);

    const filename = `faculty_${member.id}.jpg`;
    const filepath = path.join(__dirname, filename);

    // Download image
    await downloadImage(member.photoUrl, filepath);

    // Upload to Strapi
    const uploadResult = await uploadImage(filepath);

    if (uploadResult.data && uploadResult.data.length > 0) {
      const fileId = uploadResult.data[0].id;
      console.log(`  Uploaded file ID: ${fileId}`);

      // Update faculty member
      await updateFacultyPhoto(member.id, fileId);
      console.log(`  Updated faculty member ${member.id}`);
    }

    // Cleanup
    fs.unlinkSync(filepath);
    console.log(`  Done!`);
  } catch (error) {
    console.error(`  Error processing member ${member.id}:`, error.message);
  }
}

async function main() {
  console.log('Starting faculty member image uploads...\n');

  for (const member of facultyMembers) {
    await processFacultyMember(member);
    // Add delay to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log('\n✅ All faculty members processed!');
}

main().catch(console.error);
