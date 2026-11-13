# Calculadora de Mídia Local DryWash

Aplicação estática publicada pelo GitHub Pages, com Supabase Auth, PostgreSQL e Storage privado.

## Uso

Simulação e PDF são públicos. Para registrar um plano e enviar CSV/TXT (até 5 MB), entre pelo link de acesso enviado ao e-mail e autorize os usos da lista.

O painel em `#painel` exige login e autorização no banco. Apenas administradores podem alterar status e consultar solicitações de outras pessoas. Dados financeiros são projeções informadas pelo usuário e precisam ser revisados pela equipe.

## Segurança e operação

- `config.js` contém apenas URL e chave publicável; nunca use chaves secretas ou service_role no navegador.
- `schema.sql` documenta a estrutura inicial (já aplicada). Administradores são definidos exclusivamente pela equipe no banco.
- Dados e arquivos de clientes ficam no Supabase; não devem ser adicionados ao repositório.
- Novos administradores: validar identidade e inserir o e-mail em `public.drywash_admins` pelo SQL Editor. Nunca liberar edição pública dessa tabela.
- O envio padrão de e-mail do Supabase tem restrições e não substitui SMTP próprio para produção. Configure SMTP no painel de Authentication para atender e-mails fora da equipe e aumentar a capacidade de envio.
- Bibliotecas locais: jsPDF 4.2.1; supabase-js 2.119.0. Atualize após revisar releases e testar o fluxo.
- CSV de exportação neutraliza fórmulas; textos de usuários são escapados; listas só podem ser lidas pelo proprietário e administradores.
- Definir política de retenção e exclusão operacional de planos e listas conforme a necessidade da equipe.
