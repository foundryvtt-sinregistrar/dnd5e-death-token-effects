# D&D5e Death Token Effects

Módulo para **Foundry VTT 14** y el sistema **D&D5e**.

Muestra el icono de muerte de D&D5e sobre el token cuando un actor está a **0 HP** y tiene fallos de salvación de muerte. Además, puede aplicar automáticamente el estado **Dead / Muerto** al llegar a 3 fallos y quitar **Bloodied / Ensangrentado** si existe.

## Compatibilidad

| Elemento | Versión |
|---|---|
| Foundry VTT mínimo | `14` |
| Foundry VTT verificado | `14.363` |
| Sistema | `dnd5e` |
| Versión del módulo | `1.14.0` |

## Criterio de versionado

Este módulo usa el segundo número de la versión como referencia a la versión mayor de **Foundry VTT** compatible.

```text
1.14.0
│ │  └─ Parche / revisión del módulo
│ └──── Versión mayor de Foundry VTT objetivo: v14
└────── Versión mayor interna del módulo
```

Ejemplos:

| Versión | Significado |
|---|---|
| `1.14.0` | Primera versión pública del módulo para Foundry VTT v14 |
| `1.14.1` | Corrección o mejora menor para Foundry VTT v14 |
| `1.14.2` | Otro parche compatible con Foundry VTT v14 |
| `1.15.0` | Versión adaptada/verificada para Foundry VTT v15 |
| `2.14.0` | Cambio mayor del módulo manteniendo objetivo Foundry VTT v14 |

> Esta numeración no significa que haya existido una versión `1.13.x` pública.  
> El `14` se usa como referencia directa a la versión mayor de Foundry VTT.

## Qué hace

```text
HP > 0
  → quita el icono superpuesto y el recuadro rojo

HP <= 0 y 0 fallos
  → no muestra icono por defecto
  → opcionalmente puede mostrar un icono muy tenue

HP <= 0 y 1 fallo de muerte
  → muestra el icono con transparencia baja

HP <= 0 y 2 fallos de muerte
  → muestra el icono con transparencia media

HP <= 0 y 3+ fallos de muerte
  → muestra el icono con transparencia alta
  → aplica el estado Dead / Muerto
  → quita el estado Bloodied / Ensangrentado si existe
```

## Características visuales

El módulo:

- no sustituye la imagen original del token;
- dibuja el icono encima del token;
- mantiene el icono visualmente recto aunque el token esté rotado;
- coloca el icono en la esquina inferior derecha;
- aplica un margen interior de `3 px`;
- limita el tamaño máximo del icono al `50%` del token;
- añade un recuadro rojo alrededor de todo el token;
- no debería bloquear el doble click sobre el token, porque el overlay se añade como elemento visual no interactivo.

## Rutas de D&D5e usadas

```text
system.attributes.hp.value
system.attributes.death.failure
```

## Imagen por defecto

Usa esta imagen interna del sistema **D&D5e**:

```text
systems/dnd5e/icons/svg/statuses/dead.svg
```

## Color por defecto

El icono y el recuadro se tiñen en rojo sangre:

```text
#8B0000
```

## Instalación mediante Manifest URL

Puedes instalar el módulo desde Foundry usando esta URL de manifest:

```text
https://github.com/foundryvtt-sinregistrar/dnd5e-death-token-effects/releases/latest/download/module.json
```

En Foundry:

```text
Add-on Modules → Install Module → Manifest URL
```

Pega la URL anterior y pulsa **Install**.

## Instalación manual

1. Descarga el ZIP de la release.
2. Descomprime el archivo.
3. Copia la carpeta:

```text
dnd5e-death-token-effects
```

dentro de:

```text
FoundryVTT/Data/modules/
```

En Docker/Windows puede ser algo parecido a:

```text
C:\docker\foundryvtt\foundryvtt-14\data\Data\modules\dnd5e-death-token-effects
```

4. Reinicia Foundry VTT.
5. Entra en tu mundo.
6. Activa el módulo desde:

```text
Manage Modules → D&D5e Death Token Effects
```

## Configuración

Ve a:

```text
Configure Settings → Module Settings → D&D5e Death Token Effects
```

Opciones principales:

| Opción | Recomendación |
|---|---|
| **Imagen superpuesta** | `systems/dnd5e/icons/svg/statuses/dead.svg` |
| **Color de la imagen superpuesta** | `#8B0000` |
| **Transparencia con 1 fallo de muerte** | `0.25` |
| **Transparencia con 2 fallos de muerte** | `0.50` |
| **Transparencia con 3+ fallos de muerte** | `0.80` |
| **Mostrar icono con 0 fallos** | Desactivado |
| **Ajustar imagen superpuesta a la cuadrícula del token** | Activado |
| **Tamaño del icono respecto al token** | `0.50` |
| **Margen interior del icono** | `3 px` |
| **Recuadro rojo alrededor del token** | Activado |
| **Aplicar estado Muerto con 3+ fallos** | Activado |
| **Quitar estado Ensangrentado al morir** | Activado |
| **Aplicar Muerto como overlay de estado** | Desactivado |
| **Quitar Muerto al recuperar HP** | Desactivado |

## Nota de cambio de nombre

Este módulo viene de una versión local anterior llamada:

```text
dead-token-image
```

A partir de la versión pública `1.14.0`, el identificador interno correcto es:

```text
dnd5e-death-token-effects
```

Foundry lo tratará como un módulo distinto. Si tenías instalada la versión local antigua, desactiva o elimina `dead-token-image` antes de usar esta versión pública.

## Estructura del módulo

```text
dnd5e-death-token-effects/
├─ module.json
├─ README.md
├─ LICENSE
└─ scripts/
   └─ dnd5e-death-token-effects.js
```

## Publicación en GitHub

Repositorio:

```text
https://github.com/foundryvtt-sinregistrar/dnd5e-death-token-effects
```

Manifest:

```text
https://github.com/foundryvtt-sinregistrar/dnd5e-death-token-effects/releases/latest/download/module.json
```

Descarga:

```text
https://github.com/foundryvtt-sinregistrar/dnd5e-death-token-effects/releases/latest/download/dnd5e-death-token-effects.zip
```

## Cambios de la versión 1.14.0

Primera versión pública orientada a **Foundry VTT v14**.

Incluye:

- cambio de identificador interno a `dnd5e-death-token-effects`;
- compatibilidad mínima con Foundry VTT `14`;
- verificación en Foundry VTT `14.363`;
- soporte específico para sistema `dnd5e`;
- icono `dead.svg` en esquina inferior derecha;
- margen interior de `3 px`;
- tamaño máximo del icono al `50%` del token;
- recuadro rojo alrededor del token;
- transparencias progresivas según fallos de salvación de muerte;
- aplicación automática del estado `Dead / Muerto` con 3+ fallos;
- eliminación segura de `Bloodied / Ensangrentado` si existe;
- protección contra duplicados de `ActiveEffect`;
- overlay no interactivo para no bloquear el doble click sobre el token.

## Licencia

Este módulo se distribuye bajo la licencia indicada en el archivo `LICENSE`.

## Créditos

Módulo mantenido por:

```text
foundryvtt-sinregistrar
```
