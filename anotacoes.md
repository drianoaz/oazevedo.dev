- a IA é não deterministica
- a IA é stateless
- foi treinada com todo o conteúdo da internet, mesmo privado


prompt legal: o que está no contexto?



## O que é reasoning?

## O que é janela de contexto?

problema da janela de contexto ser grande
quanto mais ela encher, mais informação tem
quanto mais informação tem, ela não consegue dar uma ação exatao
exemplo várias pessoas falando ao mesmo tempo
quanto mais informação divergente tem no contexto -> menor
uma jenela por responsabilidade
mais focado tem respostas melhores

janela grande é bom para pesquisas

## o que são tools?

ferramentas que o agente possui disponível para ele usar
- grep
- ler arquivo
- skill
- operações do MCP, cada uma coisa é uma tool

## skill
- skill tem header e o header já consome token


AGENTS.md -> padrão da comunidade
NAO pedir agents.md a partir do projeto -> não pedir para o claude
"rules" -> instruções que sempre são injetadas na janela de contexto
vai direcionar o agente no caminho certo
apenas o mínimo
-> visão minina da infra
-> principios de arquitetura
-> explicar apenas o que o agente não vai conseguir inferir apartir do código
-> não precisa explicar no detalhe a estrutura de arquivos do projeto, isso pode confundir ele se ficar desatualizado

Como sei o que é relevante para meu projeto?
Onde ela está se perdendendo -> bota no agents.md

Codding patterns .md -> coisas específicas do projeto que ele foi se perdendo


CONTEXT7 -> mcp para pegar documentações atualizadas
podemos usar MCP dentro do agents.md -> dar instruções

deve rodar o lint, prettier

"SEMPRE ESCREVA CASOS DE TESTE"
"SEMPRE CUBRA OS CAMINHOS IMPORTANTES"

a melhor instrução para o agente deveria ser o proprio código

para o claude o agents.md equivale a rules

MCP -> trazer contexto de fora para dentro


RPI -> Research -> Plan -> Implement

a IA é potencializadora de cultura
