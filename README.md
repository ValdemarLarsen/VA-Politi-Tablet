<div align="center">
    <img href="https://github.com/ValdemarLarsen/VA-Politi-Tablet" width="150" src="https://i.fmfile.com/qMb3oo97IbyX4d9IgBUE5/images/logo_dark.png" alt="Material-UI logo" />
</div>
<h1 align="center">VA Politi Tablet</h1>

<div align="center">
 ESX Politi tablet udviklet af va-scripts
</div>

<div align="center">

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/project-error/pe-utils/master/LICENSE)
</div>

### Lua Utils And functions

**SendReactMessage**

This is a small wrapper for dispatching NUI messages. This is designed
to be used with the `useNuiEvent` React hook.

Signature
```lua
---@param action string The action you wish to target
---@param data any The data you wish to send along with this action
SendReactMessage(action, data)
```

Usage
```lua
SendReactMessage('setVisible', true)
```

**debugPrint**

A debug printing utility that is dependent on a convar,
if the convar is set this will print out to the console.

The convar is dependent on the name given to the resource.
It follows this format `YOUR_RESOURCE_NAME-debugMode`

To turn on debugMode add `setr YOUR_RESOURCE_NAME-debugMode 1` to 
your server.cfg or use the `setr` console command instead.

Signature (Replicates `print`)
```lua
---@param ... any[] The arguments you wish to send
debugPrint(...)
```

Usage
```lua
debugPrint('wow cool string to print', true, someOtherVar)
```

### React Utils

Signatures are not included for these utilities as the type definitions
are sufficient enough.

**useNuiEvent**

This is a custom React hook that is designed to intercept and handle
messages dispatched by the game scripts. This is the primary
way of creating passive listeners.


*Note: For now handlers can only be registered a single time. I haven't
come across a personal usecase for a cascading event system*

**Usage**
```jsx
const MyComp: React.FC = () => {
  const [state, setState] = useState('')
  
  useNuiEvent<string>('myAction', (data) => {
    // the first argument to the handler function
    // is the data argument sent using SendReactMessage
    
    // do whatever logic u want here
    setState(data)
  })
  
  return(
    <div>
      <h1>Some component</h1>
      <p>{state}</p>
    </div>
  )
}

```

**fetchNui**

This is a simple NUI focused wrapper around the standard `fetch` API.
This is the main way to accomplish active NUI data fetching 
or to trigger NUI callbacks in the game scripts.

When using this, you must always at least callback using `{}`
in the gamescripts.

*This can be heavily customized to your use case*

**Usage**
```ts
// First argument is the callback event name. 
fetchNui<ReturnData>('getClientData').then(retData => {
  console.log('Got return data from client scripts:')
  console.dir(retData)
  setClientData(retData)
}).catch(e => {
  console.error('Setting mock data due to error', e)
  setClientData({ x: 500, y: 300, z: 200})
})
```

**debugData**

This is a function allowing for mocking dispatched game script
actions in a browser environment. It will trigger `useNuiEvent` handlers
as if they were dispatched by the game scripts. **It will only fire if the current
environment is a regular browser and not CEF**

**Usage**
```ts
// This will target the useNuiEvent hooks registered with `setVisible`
// and pass them the data of `true`
debugData([
  {
    action: 'setVisible',
    data: true,
  }
])
```

**Misc Utils**

These are small but useful included utilities.

* `isEnvBrowser()` - Will return a boolean indicating if the current 
  environment is a regular browser. (Useful for logic in development)

## Development Workflow

This boilerplate was designed with development workflow in mind.
It includes some helpful scripts to accomplish that.

**Hot Builds In-Game**

When developing in-game, you can use the hot build system by
running the `start:game` script. This is essentially the start
script but it writes to disk. Meaning all that is required is a
resource restart to update the game script

**Usage**
```sh
# yarn
yarn start:game
# npm
npm run start:game
```

**Production Builds**

When you are done with development phase for your resource. You
must create a production build that is optimized and minimized.

You can do this by running the following:

```sh
npm run build
yarn build 
```

## Additional Notes

Need further support? Join our [Discord](https://discord.com/invite/HYwBjTbAY5)!
