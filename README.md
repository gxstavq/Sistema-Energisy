# Sistema Energisy

MVP web da Energisy Soluções para vendas de energia fotovoltaica. O sistema reúne cadastro de clientes, CRM, follow-up, calculadora de dimensionamento solar e geração de propostas comerciais em PDF.

## Funcionalidades

- Autenticação de vendedores com Supabase Auth.
- Dashboard com saudação personalizada e indicadores comerciais.
- Cadastro de clientes com nome, WhatsApp, e-mail, cidade, valor do projeto e observações.
- CRM em formato Kanban com os status **Novo Lead**, **Em Negociação**, **Fechado** e **Desistência**.
- Atualização de status e observações diretamente nos cards do CRM.
- Agenda de follow-up com abertura rápida de conversa no WhatsApp.
- Calculadora fotovoltaica por UF e tipo de ligação.
- Dimensionamento estimado de potência, placas, área, investimento e economia em 25 anos.
- Geração de proposta PDF em duas páginas: proposta do cliente e roteiro de vendas para o vendedor.
- Configurações comerciais locais salvas no `localStorage` do dispositivo.

## Stack

- HTML5 semântico
- CSS3 e Tailwind CSS via CDN
- JavaScript Vanilla ES6+
- Supabase Auth e Supabase Database via CDN
- html2pdf.js via CDN

O projeto não utiliza React, Node.js, TypeScript, npm ou bundlers. Cada tela é um arquivo HTML independente.

## Estrutura

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Login do vendedor |
| `dashboard.html` | Dashboard e métricas comerciais |
| `novo-cliente.html` | Cadastro de clientes |
| `crm.html` | Funil Kanban e observações da negociação |
| `simulador.html` | Calculadora solar e geração de propostas PDF |
| `followup.html` | Lista de clientes para contato |
| `configuracoes.html` | Valores comerciais salvos no dispositivo |
| `supabase-config.js` | Inicialização do Supabase |
| `auth-utils.js` | Utilitários de autenticação e saudação |
| `logoenergisy.PNG` | Logo oficial da Energisy |

## Configuração do Supabase

1. Crie um projeto no Supabase.
2. Atualize `supabase-config.js` com a URL do projeto e a chave pública anon/publishable.
3. Execute o SQL abaixo no SQL Editor do Supabase.
4. Configure a confirmação de e-mail conforme a política de acesso da sua operação.

```sql
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  cidade TEXT,
  valor_projeto NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Novo Lead',
  observacoes_iniciais TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem visualizar seus clientes" ON public.clientes;
CREATE POLICY "Usuários podem visualizar seus clientes"
  ON public.clientes FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem cadastrar seus clientes" ON public.clientes;
CREATE POLICY "Usuários podem cadastrar seus clientes"
  ON public.clientes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar seus clientes" ON public.clientes;
CREATE POLICY "Usuários podem atualizar seus clientes"
  ON public.clientes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

O usuário autenticado só consegue consultar ou alterar registros cujo `user_id` seja igual ao próprio `auth.uid()`.

## Como executar

Como o projeto é estático, basta abrir `index.html` no navegador. É necessário estar conectado à internet para carregar Tailwind CSS, Supabase JS e html2pdf.js pelas CDNs.

Para uma experiência mais próxima de produção, sirva a pasta com qualquer servidor HTTP estático e acesse `index.html` pelo navegador.

## Regras da calculadora

O simulador utiliza tarifas médias estimadas por estado e mantém a tabela no objeto `STATE_KWH_TARIFFS_2026`.

```text
Consumo médio = Valor da conta / Tarifa do kWh
Consumo compensável = máximo(Consumo médio - custo de disponibilidade, 0)
Potência do sistema = Consumo compensável / 120
Quantidade de placas = teto(Potência / 0,55)
Área necessária = Quantidade de placas × 2,2 m²
Investimento = Potência × R$ 4.000,00
Economia em 25 anos = máximo(Conta - taxa mínima, 0) × 12 × 25
```

O custo de disponibilidade considerado é de 50 kWh para ligação residencial bifásica e 100 kWh para ligação comercial trifásica. Os valores são estimativas comerciais e devem ser validados no projeto executivo.

## Configurações locais

Os valores comerciais da tela de configurações são armazenados somente no navegador atual, na chave:

```text
energisy_configuracoes
```

Eles não são sincronizados com o Supabase nem com outros dispositivos.

## Segurança

- Use apenas a chave pública anon/publishable no frontend.
- Nunca coloque uma `service_role key` em arquivos HTML ou JavaScript públicos.
- Mantenha o Row Level Security habilitado no Supabase.
- Revise as políticas antes de publicar o sistema em produção.

## Identidade visual

A interface utiliza a identidade da Energisy Soluções:

- Azul para navegação, títulos, fundos e ações principais.
- Amarelo para destaques, métricas e chamadas de ação.
- Fundo neutro claro e cards brancos com sombras suaves.

## Status do projeto

MVP funcional com autenticação, CRM, cadastro de clientes, follow-up, simulador fotovoltaico e geração de propostas comerciais em PDF.
