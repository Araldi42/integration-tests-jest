const pactum = require('pactum');

const BASE_URL = 'https://jsonplaceholder.typicode.com';

describe('Pactum - Testes da API JSONPlaceholder', () => {

  test('GET /posts/1 - Deve retornar um post com id 1', async () => {
    await pactum.spec()
      .get(`${BASE_URL}/posts/1`)
      .expectStatus(200)
      .expectJsonLike({ id: 1 })
      .expectJsonSchema({
        type: 'object',
        properties: {
          id: { type: 'number' },
          title: { type: 'string' },
          body: { type: 'string' }
        },
        required: ['id', 'title', 'body']
      });
  });

  test('GET /comments?postId=1 - Deve retornar comentários do post 1', async () => {
    await pactum.spec()
      .get(`${BASE_URL}/comments`)
      .withQueryParams('postId', 1)
      .expectStatus(200)
      .expectJsonMatch('[0].postId', 1)
      .expectJsonLength(5);
  });

  test('POST /posts - Deve criar um novo post com sucesso', async () => {
    const payload = {
      title: 'Novo Post Pactum',
      body: 'Conteúdo via Pactum',
      userId: 99
    };

    await pactum.spec()
      .post(`${BASE_URL}/posts`)
      .withJson(payload)
      .expectStatus(201)
      .expectJsonLike(payload)
      .expectJsonMatch('userId', 99)
      .expectJsonSchema({
        type: 'object',
        required: ['id', 'title', 'body', 'userId']
      });
  });

  test('PUT /posts/1 - Deve atualizar o post com id 1', async () => {
    const payload = {
      title: 'Atualizado via PUT',
      body: 'Novo conteúdo',
      userId: 1
    };

    await pactum.spec()
      .put(`${BASE_URL}/posts/1`)
      .withJson(payload)
      .expectStatus(200)
      .expectJsonLike({ id: 1, ...payload });
  });

  test('PATCH /posts/1 - Deve atualizar parcialmente o título', async () => {
    const patchData = { title: 'Título Alterado Parcialmente' };

    await pactum.spec()
      .patch(`${BASE_URL}/posts/1`)
      .withJson(patchData)
      .expectStatus(200)
      .expectJsonLike({ id: 1, title: patchData.title });
  });

  test('DELETE /posts/1 - Deve excluir um post', async () => {
    await pactum.spec()
      .delete(`${BASE_URL}/posts/1`)
      .expectStatus(200);
  });

  test('GET /invalid - Deve retornar 404 para rota inválida', async () => {
    await pactum.spec()
      .get(`${BASE_URL}/invalid`)
      .expectStatus(404);
  });

  test('GET /users - Deve retornar cabeçalhos de resposta padrão', async () => {
    await pactum.spec()
      .get(`${BASE_URL}/users`)
      .expectStatus(200)
      .expectHeader('content-type', /application\/json/);
  });

  test('GET /posts - Deve conter um post com userId 1', async () => {
    await pactum.spec()
      .get(`${BASE_URL}/posts`)
      .expectStatus(200)
      .expectBodyContains('userId');
  });

  test('GET /todos/1 - Deve validar dados de uma tarefa', async () => {
    await pactum.spec()
      .get(`${BASE_URL}/todos/1`)
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        userId: 1,
        completed: false
      })
      .expectJsonSchema({
        type: 'object',
        required: ['id', 'title', 'completed', 'userId'],
        properties: {
          title: { type: 'string' },
          completed: { type: 'boolean' },
          id: { type: 'number' },
          userId: { type: 'number' }
        }
      });
      
  });

});
