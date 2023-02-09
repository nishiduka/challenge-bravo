## Organização
O desafio foi divido em duas aplicações: server e a updateQuotationBatch.

O código para cotação ficou dentro da pasta `server` e a pasta `updateQuotationBatch` ficou um batch com um cron que irá atualizar a moeda a cada 1 hora.

Para o batch funcionar, é necessário que suba o container, pois toda a configuração para rodar a cron, ficou lá dentro.

## Para iniciar o projeto
Antes de iniciar, é necessário ter o docker instalado, juntamente com o orquestrador `docker-composer`. 
Para startar o projeto, é preciso rodar o comando `docker-compose up` na pasta raiz do projeto.

## Desenvolvimento
### Server

A API foi escrita utilizando typescript + node + express.
Para o banco de dados, foi utilizado o Redis.
Para facilitar, está acompanhado do projeto a collection do postman, com todas as requisições.
A organização de pastas ficou a seguinte:
```
.
├── src
│   ├── Controllers
│   └── Repository
│   └── Services
│   └── Utils
```

Na pasta Controllers, ficaram os arquivos responsáveis por formar a rota, tratar o body e a passar a lógica para um Services.
Na pasta Services ficaram os arquivos com toda a lógica e regra de negócios.
Na pasta Repository ficaram as lógicas envolvendo banco de dados e popular o banco.
Na pasta Utils ficaram alguns arquivos de apoio ao desenvolvimento.

A lógica base utilizada foi: pegar a moeda que está vindo e converte-la em Dollar, para padronizar todas as cotações.
O fluxo ficou mais ou menos assim, considerando o payload `?from=BTC&to=EUR&amount=123.45`.

- Requisita a cotação do BTC para USD e salva no banco;
- Busca a cotação de EUR para USD, salva no banco;
- Multiplica a `amount` pela cotação do BTC em USD e multiplica o resultado pelo EUR para USD

#### Endpoints
##### GET `/api/currency/convert?from=BTC&to=EUR&amount=123.45`
Retorna a cotação seguingo o from e o to;
____

##### POST `/api/currency/new`

Body 
```
{
	"from": "GTA",
	"value": 10
}
```

Cria uma nova cotação em Dolar.

___

##### PATCH `/api/currency/update/:coin`

Body 
```
{
	"value": 10
}
```

Atualiza uma nova cotação.

___

##### DELETE `/api/currency/:coin`
Remove uma cotação

### Batch
A aplicações foi escrita com JS Vanilla, para que seja um código simples de rodar, sem precisar de muitas dependências ou processos de builds.
Para iniciar, é só executar o comando `yarn start` ou `npm run start`.
Lembrando que, para iniciar é nessário que o .env esteja na pasta do batch. O .env é o mesmo da aplicação `server`.