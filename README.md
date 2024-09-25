
# ProjectPlayer

The Project Player is a flexible Angular-based Web component for project consumption. Easily adaptable for various frameworks or vanilla JS apps. Enhance user experiences seamlessly built with the help of angular version 17.
## Prerequisites for setup

Angular 17, Nodejs 18.20.7

## Setup

* clone this [repository](https://github.com/ELEVATE-Project/project-player)
* Run `npm install` after cloning the repo in local to install the necessary dependencies

## Build ProjectPlayer and generate the webcomponent

Run `npm run build-player` To build the player with the latest changes and to reflect the changes in webcomponent

## Demo Application

Navigate to `projects/demo-app` and Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

In-case the changes have been done in the library, after successful build by `npm run build-player` the changes would automatically reflect in the app as well. ( only applicable to this app and not the react demo app).

## Webcomponent

## Steps to Include Web Component in Angular Project

1. **Download the Web Component**
   - Run the following command to install the web component:
     ```bash
     npm i project-player
     ```

2. **Include the Web Component Script**
   - Open the `angular.json` file.
   - Navigate to the `"scripts"` section under `projects -> project-player-library -> architect -> build`.
   - Add the path to the web component script:
     ```json
     "scripts": [
       "node_modules/project-player/project-player-component.js"
     ]
     ```

3. **Include the Web Component Styles**
   - In the same `angular.json` file, go to the `"styles"` section under `projects -> project-player-library -> architect -> build`.
   - Add the path to the web component's CSS file:
     ```json
     "styles": [
       "node_modules/project-player/styles.css"
     ]
     ```

4. **Include Schemas in the module.ts file**
    - Add the below schema in the module file of the angular application
    ```
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
    ```
## Steps to Consume the Project Web Component

###  Adding the Web Component Tag to an HTML File
Add the following tag created from the web component:

```html
<project-player [config]="config" [projectData]="projectData"></project-player>
```
```
config = {
  maxFileSize: <sizeInNumber>,
  baseUrl: <projectBaseUrl>,
  accessToken: <accessToken>,
  profileInfo: {}
}
```
```
projectData = <projectData>;
```

## Configuration and Project Data
1. **config**: This object contains the key settings for the player:
   - **maxFileSize**: The maximum file size (in MB) allowed for attachments at both the project and task levels.
   - **baseUrl**: The base URL for hitting APIs that retrieve project info and sync the project.
   - **accessToken**: Used for authentication and securing API calls that require a token.
   - **profileInfo**: Any additional user profile-related data.

2. **projectData**:
   - This object holds data to enable various functionalities within the project player.
   - The unique identifier for the project.
   - Used to retrieve project-related data from the server's API.
   - Helps the web component load and interact with specific project data.

   - [Example projectData object](https://docs.google.com/document/d/1qF9Z-4omKjDtgF0tMIrCHF7CsyAx5hTWT8PT9R5rHpM/edit?usp=sharing) for more details.

### Global Styling for the Player
This section contains the global styles that should be added to the application's global styles file (e.g., `global.scss`). These styles will be used to define the visual appearance and theme for the player.

```css
:root {
    --primary-color: <color>;
    --disabled-btn-bg: <color>;
    --disabled-btn-text: <color>;
}
```
