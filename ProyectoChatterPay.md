# ChatterPay — Cómo funciona

## ¿Qué es ChatterPay?

ChatterPay es una **crypto wallet no-custodial** que permite a cualquier persona enviar, recibir e intercambiar criptomonedas usando únicamente **WhatsApp**. No requiere descargar ninguna aplicación adicional, no exige conocimientos de blockchain y elimina por completo la necesidad de gestionar frases semilla o claves privadas.

Su propuesta central es simple: llevar crypto a donde las personas ya están, en lugar de pedirles que vayan a donde está el crypto.

---

## Arquitectura tecnológica

### 1. Blockchain: Scroll

ChatterPay opera sobre la blockchain de **Scroll**, una solución de escalabilidad de capa 2 (L2) para Ethereum basada en **zkEVM** (Zero-Knowledge Ethereum Virtual Machine).

Scroll hereda la seguridad de Ethereum pero ofrece:

- **Tarifas de transacción significativamente más bajas** que la red principal de Ethereum.
- **Confirmaciones de transacción rápidas**, lo que hace viable el uso cotidiano.
- **Compatibilidad total con el ecosistema Ethereum**: los contratos inteligentes, tokens y estándares (ERC-20, ERC-721) funcionan de la misma forma.

Esto significa que cada wallet de ChatterPay es, en esencia, una wallet de Ethereum que vive y opera en la red de Scroll.

---

### 2. Interfaz gráfica: un ChatBot de WhatsApp

La interfaz de usuario de ChatterPay **no es una app, no es una web, no es un dashboard**. Es una conversación de WhatsApp.

El usuario interactúa con un **bot inteligente** a través del chat de WhatsApp. Puede:

- Enviar mensajes en lenguaje natural: *"send 10 USDT to Maria"*
- Consultar su saldo
- Solicitar un swap entre tokens
- Subir imágenes para crear NFTs
- Recibir notificaciones de transacciones en tiempo real

El bot interpreta las instrucciones, las traduce a operaciones on-chain y ejecuta las transacciones en Scroll, todo de forma transparente para el usuario. Desde la perspectiva del usuario, es tan simple como chatear con un contacto.

---

### 3. Account Abstraction: wallets ligadas al número de teléfono

Este es el componente técnico más relevante de ChatterPay. En lugar de generar wallets tradicionales que requieren gestión manual de claves privadas, ChatterPay utiliza **Account Abstraction (ERC-4337)**.

#### ¿Cómo funciona?

Cuando un usuario interactúa con el bot por primera vez, ChatterPay genera automáticamente una **smart contract wallet** (wallet de contrato inteligente) vinculada de forma única a su **número de teléfono / número de WhatsApp**.

Esto tiene varias implicaciones importantes:

| Wallet tradicional | ChatterPay (Account Abstraction) |
|---|---|
| El usuario gestiona una clave privada | La wallet es un contrato inteligente |
| Se necesita guardar una frase semilla | No hay frase semilla |
| Pérdida de clave = pérdida de fondos | Recuperación posible mediante mecanismos de custodia social o lógica programable |
| El usuario debe firmar cada transacción manualmente | El bot puede gestionar firmas en nombre del usuario bajo reglas definidas |

#### Ventajas prácticas de Account Abstraction en ChatterPay

- **Sin seed phrases**: el usuario no necesita anotar ni recordar nada.
- **Creación instantánea**: la wallet se genera en el momento en que el usuario escribe su primer mensaje.
- **Identificación por número**: tu wallet es tu número de WhatsApp. Enviar crypto a alguien es tan fácil como enviarle un mensaje.
- **Lógica personalizable**: los contratos inteligentes pueden implementar límites de gasto, autorizaciones múltiples, recuperación de cuenta y otras funcionalidades imposibles en wallets EOA (Externally Owned Accounts) tradicionales.

La seguridad adicional recae en medidas como el **SIM PIN** y la **autenticación de dos factores (2FA)** del propio WhatsApp, que ChatterPay recomienda activamente a sus usuarios.

---

### 4. Creación de NFTs desde WhatsApp

ChatterPay permite a cualquier usuario **mintear NFTs directamente desde el chat de WhatsApp**, sin necesidad de usar plataformas especializadas, conectar wallets externas ni pagar tarifas elevadas.

#### El proceso es el siguiente:

1. El usuario **sube una imagen** directamente al chat de WhatsApp (foto, arte, ilustración, etc.).
2. Indica al bot que quiere crear un NFT y proporciona una descripción o nombre.
3. ChatterPay procesa la solicitud y **registra el NFT en la blockchain de Scroll** bajo el estándar **ERC-721**.
4. El usuario recibe confirmación en el chat y el NFT queda asociado a su wallet.

El NFT existe en la cadena de bloques de forma permanente, es transferible, verificable y propiedad inequívoca del usuario que lo creó.

Este mecanismo democratiza la creación de activos digitales: cualquier persona con acceso a WhatsApp puede convertirse en creador en blockchain, sin pasar por ninguna curva de aprendizaje técnica.

---

## Tokens y activos soportados

ChatterPay soporta múltiples activos dentro de su ecosistema:

- **USDT** — Tether, stablecoin anclada al dólar estadounidense
- **USDC** — USD Coin, otra stablecoin de referencia en el mercado
- **USX** — Stablecoin nativa del ecosistema, orientada al uso cotidiano
- **wstETH** — Wrapped Staked ETH (Lido Finance): permite a los usuarios obtener recompensas de staking de Ethereum mientras mantienen liquidez, directamente desde WhatsApp

---

## Funcionalidades principales

| Funcionalidad | Descripción |
|---|---|
| **Enviar** | Transferir tokens a otro número de WhatsApp o dirección de wallet |
| **Recibir** | Recibir fondos que se notifican automáticamente en el chat |
| **Swap** | Intercambiar un token por otro desde el chat |
| **Staking** | Generar rendimientos pasivos con wstETH sin bloquear los fondos |
| **Mintear NFTs** | Crear activos digitales en blockchain subiendo imágenes al chat |
| **Consultar saldo** | Ver el estado de la wallet en cualquier momento |
| **Nota de voz** | Posibilidad de enviar instrucciones mediante mensajes de voz |

---

## Seguridad

Al eliminar las frases semilla, ChatterPay traslada la seguridad hacia capas que el usuario ya maneja en su vida cotidiana:

- **SIM PIN**: protege el número de teléfono ante ataques de SIM swapping.
- **2FA de WhatsApp**: verificación en dos pasos nativa de la plataforma.
- **Smart contract wallet**: la lógica del contrato puede incorporar restricciones adicionales, como límites de transacción o autorizaciones requeridas.

---

## Modelo de adopción

ChatterPay no busca convencer a los usuarios de que aprendan sobre blockchain. Su hipótesis de adopción es la inversa: **llevar blockchain a donde las personas ya están**.

Con más de 2.000 millones de usuarios activos en WhatsApp a nivel global, la plataforma representa el canal de mayor penetración para alcanzar a usuarios no bancarizados, mercados emergentes y comunidades que históricamente han quedado fuera del sistema financiero tradicional.

Los mercados con mayor tracción inicial incluyen países de África subsahariana (particularmente Nigeria), Latinoamérica (Argentina, Colombia, Venezuela) y comunidades de la diáspora que realizan remesas internacionales de forma regular.

---

## Programa de embajadores

ChatterPay cuenta con un **programa de embajadores** activo, a través del cual miembros de la comunidad reciben incentivos por incorporar nuevos usuarios a la plataforma. Los embajadores compiten mensualmente en un leaderboard público que refleja el número de wallets creadas en sus respectivas comunidades.

---

## Ecosistema e integraciones

- **Blockchain**: Scroll (zkEVM L2 de Ethereum)
- **Staking**: Lido Finance (wstETH)
- **NFTs**: Scroll_ZKP (infraestructura de NFTs en Scroll)
- **Interfaz**: API de WhatsApp Business
- **Estándar de wallet**: ERC-4337 (Account Abstraction)

---

## Resumen

ChatterPay es la demostración práctica de que la adopción masiva de blockchain no pasa por educar al usuario en DeFi, sino por eliminar toda fricción tecnológica. Una wallet sin seed phrase, una interfaz que ya existe en el teléfono de cualquier persona y transacciones que se ejecutan con un mensaje de texto: eso es ChatterPay.

> *"ChatterPay allows anyone to use crypto with just WhatsApp messages."*
