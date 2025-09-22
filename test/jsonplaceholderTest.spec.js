const https = require('https');

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';

      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(new Error('Status Code: ' + res.statusCode));
      }

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH') {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

describe('JSONPlaceholder API - Testes de múltiplas rotas e métodos', () => {
  test('GET /posts/1 - Deve retornar um post com id 1', async () => {
    const data = await fetchUrl('https://jsonplaceholder.typicode.com/posts/1');
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('body');
  });

  test('GET /comments?postId=1 - Deve retornar comentários do post com id 1', async () => {
    const data = await fetchUrl('https://jsonplaceholder.typicode.com/comments?postId=1');
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toHaveProperty('postId', 1);
  });

  test('POST /posts - Deve criar um novo post', async () => {
    const newPost = {
      title: 'Novo Post',
      body: 'Conteúdo do novo post',
      userId: 1,
    };
    const data = await fetchUrl('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: newPost,
      headers: { 'Content-Type': 'application/json' },
    });
    expect(data).toHaveProperty('id');
    expect(data).toMatchObject(newPost);
  });

  test('PUT /posts/1 - Deve atualizar o post com id 1', async () => {
    const updatedPost = {
      title: 'Post Atualizado',
      body: 'Conteúdo do post atualizado',
      userId: 1,
    };
    const data = await fetchUrl('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'PUT',
      body: updatedPost,
      headers: { 'Content-Type': 'application/json' },
    });
    expect(data).toHaveProperty('id', 1);
    expect(data).toMatchObject(updatedPost);
  });

  test('PATCH /posts/1 - Deve atualizar parcialmente o post com id 1', async () => {
    const partialUpdate = {
      title: 'Título Atualizado Parcialmente',
    };
    const data = await fetchUrl('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'PATCH',
      body: partialUpdate,
      headers: { 'Content-Type': 'application/json' },
    });
    expect(data).toHaveProperty('id', 1);
    expect(data).toMatchObject(partialUpdate);
  });

  test('DELETE /posts/1 - Deve excluir o post com id 1', async () => {
    await fetchUrl('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'DELETE',
    });
    // Não há confirmação direta de exclusão, mas podemos verificar que o post não existe mais
    try {
      await fetchUrl('https://jsonplaceholder.typicode.com/posts/1');
    } catch (error) {
      expect(error.message).toMatch(/Status Code: 404/);
    }
  });
});
