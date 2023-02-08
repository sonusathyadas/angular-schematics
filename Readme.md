# Angular Schematics

## What is Schematics?
Schematics are template based code generators that can transform your project by adding or updating files. You may need to install npm packages and update various files to configure features in Angular applications. Consider you are planning to update your applciation with `Angular Material`. You need to install material theme files to your application and update `angular.json` to include the style and scripts. Also you may need to create the various components to design the navigation bar or dashboard. You can simplify these tasks by using schematics. By using `angular material` schematics, you can automate all these operations of installing packages and generating `dashboard` or `navbar` components. Lets try this.

1) Create an Angular workspace using the Angular CLI.
    ```shell
    ng new schematics-workspace --create-application false --skips-tests 
    ```
2) This will create an empty workspace without any project. You can now create an Angular project of application type.
    ```shell
    ng generate application web-ui-app --routing --style css
    ```
3) Run and test the application. You will see the default landing page of the Angular application.
    ```shell
    ng serve --open
    ```
4) Install the *Angular Material* theme to the project using theschematics. Run the following command to add and configure the *Angular Material*. Choose an appropriate color theme while installing.
    ```shell
    ng add @angular/material
    ```

5) This will update the `angular.json` file and `package.json` files to add the references to the Angular material npm packages.
You can now create a navigation bar componenet using the schematics that provides responsive UI for you web application. Run the following command to create the navbar component.
    ```shell
    ng generate @angular/material:navigation components/navigation
    ```

6) Open the `src\app\components\navigation.html` file and add `<router-outlet>` below the **`<!-- Add Content Here -->`** line.
7) Open the `src\app\app.component.html` file and remove all code from it. Add the following line to the file.
    ```
    <app-navigation></app-navigation>
    ```
> [!WARNING]
> Ensure the selector of `navigation` component's selector is `app-navigation`. If not use the correct selector to add the component in the `app.compoent.html` file.

8) Re-run the project. Stop the project if it is already running. Because you have updated the `angular.json` file, it requires a restart. You will be able to see the navigation bar component when the application runs.

You have added a responsive Angular Material navigation bar to the project with less or no effort. All the configurations are done by the Angular Schematics CLI. You can also generate other Angular Material components such as `dashboard`, `address-form` etc.

## Creating custom schematics in Angular 
We have seen how Angular Material schematics helped us to easily create and add a navigation bar component with reponsive nature. It created all required files and updated configurations when you run the `ng generate` command. You can also create such schematics to generate files and updating configurations automatically. Now we will see how the schematics can help us to do so.

1) Install the Schematics CLI in your system.
    ```shell
    npm install -g @angular-devkit/schematics-cli    
    ```

2) This will provide the `schematics` command globally. You can use this command to create a new schematics project or list schematics from an available schematics project.
    ```shell
    schematics @angular/material: --list-schematics
    ```
3) Create a new schematics project using the following command. Create the project outside the Angular project workspace.
    ```shell
    schematics blank sample-schematics
    ```

4) This will create a schematics project with the following files.
    * package.json
    * tsconfig.json
    * src\collection.json
    * src\sample-schematics\index.ts
    * src\sample-schematics\index.spec.ts

    The `src\collection.json` file contains the list of schematics exported from this package. The default schematics is created inside the `src\sample-schematics` directory. It contains an `index.ts` file that contains the action definition for the schematics. In the `collection.json` you can see the `sample-schematics` configuration.
    ```json
    "sample-schematics": {
        "description": "A blank schematic.",
        "factory": "./sample-schematics/index#sampleSchematics"
    }
    ```
5) Open the `package.json` file. You can see a script command to build the schematics project. Add a new script command to run and build the project in watch mode.
    ```json
    "scripts": {
        "build": "tsc -p tsconfig.json",
        "build:watch": "tsc -p tsconfig.json --watch",
        "test": "npm run build && jasmine src/**/*_spec.js"
    },
    ```

6) Build the project by using the following command in terminal.
    ```shell
    npm run build:watch
    ```

7) Test the `sample-schematics`. Run the following command. 
    ```shell
    schematics .:sample-schematics
    ```

8) You can add a new schematics to the existing project using the following command.
    ```shell
    schematics blank greeter
    ```
9) This will create a new schematics named `greeter`. It will create a new folder under `src` with the name `greeter`. Also it updates the `collection.json` to add the schematics configuration for `greeter`.

10) Open the `src\greeter\index.ts` and update the method to generate a `hello.js` file with a simple greet message.

    ```javascript
    export function greeter(_options: any): Rule {
        return (tree: Tree, _context: SchematicContext) => {
            tree.create('hello.js', `console.log('Hello User')`);
            return tree;
        };
    }
    ```

11) Build and run the schematics. Use the following command to run the schematics.
    ```shell
    schematics .:greeter
    ```
12) The schematics will execute successfully. But it will not create any file in the directory. Because the project run in the dry run state. You can run it without dry run mode.
    ```shell
    schematics .:greeter --dry-run false
    ```
    The above command will create a `hello.js` file in the curent directory. 
13) Now, we need to update the `greeter` schematics to accept a user name as input to generate the file with a personalized message. For that you need to define a schema for parameters. Create `schema.json` and `schema.d.ts` file in the `src\greeter` folder.
14) Open the `schema.d.ts` file and create an interface to define the list of parameters.
    ```typescript
    export interface Schema{
        name:string
    }
    ```

15) Open the `schema.json` file and add the following code to define the schema for `greeter` schematics. It defines a parameter `name` that is accepted while executing the `greeter` schematics.
    ```json
    {
        "$schema": "http://json-schema.org/schema",
        "$id": "GreeterSchema",
        "title": "Greeter Schema",
        "type": "object",
        "description": "Print a personalized greet message",
        "properties": {
            "name": {
                "type": "string",
                "description": "Name of the person you want to greet",
                "$default": {
                    "$source": "argv",
                    "index": 0
                }
            }
        },
        "required": [
            "name"
        ]
    }
    ```

16) Open the `collection.json` to update the schemat definition for `greeter`. Add a schema configuration for it.
    ```json
    "greeter": {
        "description": "A blank schematic.",
        "factory": "./greeter/index#greeter",
        "schema": "./greeter/schema.json"
    }    
    ```
17) Open the `index.ts` for `greeter` and update the `_options` argument type from `any` to `Schema`. In the function definition you can read the name parameter from the `_options` argument and use it to print the personalized message.
    ```typescript
    import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
    import { Schema } from './schema';
    
    export function greeter(_options: Schema): Rule {
        return (tree: Tree, _context: SchematicContext) => {
            let name = _options.name;
            if(tree.exists('hello.js')){
                tree.delete('hello.js');
            }
            tree.create('hello.js', `console.log('Hello ${name}')`);
            return tree;
        };
    }
    ```
18) Build the project and test it. You can run the schematics by using the following command. 
    ```shell
    schematics .:greeter demouser --dry-run false
    ```
    > [!WARNING]
    > Ensure the `hello.js` created in the previous run is deleted before you run it. Otherwise it will update existing `hello.js` and  show an `UPDATE` message instead on `CREATE`.


## Advanced Schematics that uses templates to generate files

We can generate files using schematics with the help of template files. The template files are typically stored inside the `files` folder inside the schematics directory. Angular schematics provides a `strings` library that provides a set of functions to transform the file and folder names. These functions helps us to easily capitalize, camelize, classify or dasherize the names. For example when we provide a file name as `MyDemo`, the `dasherize` function can convert it into `my-demo`. The `camelize` function can convert it into `myDemo` format. To use these functions in files and folders along with the name parameter, you need to use `__name@dasherize__.js` format. Here the `name` is the name parameter accepted using schematics command line. Similarly, to camelize the file name, use `__name@camelize__.js` format. Template files such as *.js, *.ts files can contain interpolations like `<%  %>` and `<%=  %>`. You can print variables in template files using `<%= variable %>` and execute code using `<% code %>`.

We can try this in the following demo.

1) Create a folder named `files` inside the `greeter` schematics folder. Create a subfolder with the name `__name@dasherize__`. Create a new file with the name `__name@dasherize__.hello.js` inside the subfolder.

    ```
        src
         |_ greeter
              |_ files
                   |_ __name@dasherize__
                          |_ __name@dasherize__.hello.js   
    ```
2) Open the `__name@dasherize__.hello.js` file and add the following code to it. 
    ```javascript
    console.log(`Hello <%= dasherize(name) %> `)
    ```

3) Open the `index.ts` file in `greeter` folder and update the code. Update the import statements with the following.
    ```typescript
    import { strings } from '@angular-devkit/core';
    import { apply, Rule, SchematicContext, Tree, url, template, mergeWith } from '@angular-devkit/schematics';
    import { Schema } from './schema';
    ```

4) Also update the `greeter` method to use the template files to generate the file.
    ```typescript
    export function hello(_options: Schema): Rule {
        return (tree: Tree, _context: SchematicContext) => {

            const sourceTemplate = url("./files");
            const parameterizedTemplate = apply(sourceTemplate,[
                template({
                    ..._options,
                    ...strings
                })
            ]);
            tree = mergeWith(parameterizedTemplate)(tree,_context) as Tree;
            return tree;
        };
    }
    ```

    We are passing the `..._options` and `...strings` to the `template` method. It is used to pass the schema variables and the string utility methods such as dasherize, capitalzie, camelize and classify to the template file. So we can use those parameter variables and string functions in out template file.

5) Build the project. Run the following commands to test the schematics.

    ```bash
    schematics .:greeter DemoUser --dry-run false
    ```
    ```bash
    schematics .:greeter sampleUser --dry-run false
    ```
    ```bash
    schematics .:greeter dummy_user --dry-run false
    ```

6) You will be able to see the directories created for each user name and corresponding dasherized files inside it.

## Create Angular service and model using schematics
We have now understood the use of template file and the file name transformations using string methods. We can now try to create an Angular service class to provide some http operations. 

1) Create a new schematics using the following command.
    ```bash
    schematics blank http-resource
    ```

2) This will create a new schematics and add it to the `collection.json`. You can now create a schema file to accept the paramters required for the `http-resource` schematics. Add `schema.json` and `schema.d.ts` file to the schematics folder. 
3) Open the `schema.d.ts` file and add the following code.
    ```typescript
    export interface Schema{
        name:string;
        url:string;
    }
    ```
4) Define the JSON schema in the `schema.json` file. Add the following lines to it.
    ```json
    {
        "$schema": "http://json-schema.org/schema",
        "$id": "HttpResource",
        "title": "Http Resource",
        "type": "object",
        "description": "Service class to perform http operations",
        "properties": {
            "name": {
                "type": "string",
                "description": "Name of the http service class",
                "$default": {
                    "$source": "argv",
                    "index": 0
                }
            },
            "url": {
                "type": "string",
                "description": "Base Url of the API service",
                "x-prompt": "What is the API base url (eg: http://domain.com/api/resource)?"
            }
        },
        "required": [
            "name"
        ]
    }
    ```

5) Update the schematics definition in `collection.json` to define the schema property for the `http-resource` schematics.
    ```json
    "http-resource": {
        "description": "A blank schematic.",
        "factory": "./http-resource/index#httpResource",
        "schema": "./http-resource/schema.json"
    }
    ```

6) Now, we need to create the template files for the schematics. Create `files` directory inside the `http-resource` directory and create a subfolder with the name `__name@dasherize__`. Add two files to it - one model interface and an angular service class. Create `__name@dasherize__.ts` and `__name@dasherize__.service.ts` files inside the subfolder.

7) Open `__name@dasherize__.ts` file and add the following code to it.
    ```typescript
    export interface <%= classify(name) %>{
        id:number;
    }
    ```

8) Add the following code to `__name@dasherize__.service.ts` file.
    ```typescript
    import {Injectable} from '@angular/core';
    import {HttpClient} from '@angular/common/http';
    import { Observable} from 'rxjs';

    import {<%= classify(name) %>} from './<%= dasherize(name) %>'

    const API_URL= '<%= url %>';

    @Injectable({
        providedIn:'root'
    })
    export class <%= classify(name)%>CrudService{
        
        constructor(private http:HttpClient){

        }

        findAll():Observable<<%=classify(name) %>[]>{
            return this.http.get<<%=classify(name)%>[]>(API_URL);
        }

    }
    ```

9) Update the `index.ts` to generate the files using templates.
    ```typescript
    import { strings } from '@angular-devkit/core';
    import { apply, Rule, SchematicContext, Tree, url, template, mergeWith } from '@angular-devkit/schematics';
    import { Schema } from './schema';
    
    export function httpResource(_options: Schema): Rule {
      return (tree: Tree, _context: SchematicContext) => {
        const sourceTemplate = url("./files");
        const parameterizedTemplate = apply(sourceTemplate, [
          template({
            ..._options,
            ...strings
          })
        ]);
        tree = mergeWith(parameterizedTemplate)(tree, _context) as Tree;
        return tree;
      };
    }    
    ```
10) Build the project and run the schematics using the following command.
    ```bash
    schematics .:http-resource employee --url http://somedomain.com/api/employee --dry-run false
    ```
    You will be able to see the `employee` folder and the service class and model interface file inside it.

11) Now, we can add an optional parameter to the schematics. For that we will use a `findOne` flag that creates a `findOne(id:number)` method in the service class if true otherwise not. Update the `Schema` interface to add `findOne` boolean member.
    ```typescript
    export interface Schema{
        name:string;
        url:string;
        findOne:boolean;
    }
    ```
12) Update the `schema.json` to define the `findOne` parameter.
    ```json
    "findOne":{
        "type":"boolean",
        "description": "True if want to generate a findOne method else false",
        "default":false
    }
    ```

13) Open `__name@dasherize__.service.ts` file and add the following code below the `findAll` method to generate the `findOne` method based on the boolean parameter `findOne`.
    ```typescript
    <% if(findOne){ %>
    findOne(id:number):Observable<<%=classify(name)%>>{
        return this.http.get<<%=classify(name)%>>(`${API_URL}/${id}`)
    }
    <% } %>
    ```

14) Build the project and test with the following commands.
    ```bash
    schematics .:http-resource employee --url http://somedomain.com/api/employee  --findOne --dry-run false
    ```
    ```bash
    schematics .:http-resource product --url http://somedomain.com/api/products  --dry-run false
    ```

## Integrating schematics with Angular
We have created and tested the schematics successfully. But we have not yet used them inside an Angular project. To use the schematics with angular projects you need to install the `@schematics/angular` package to the schematics project. This will provide the utility methods and classes required to access the Angular project workspace and projects. Install the `@schematics/angular` with the following command.

    ```bash
    npm i @schematics/angular
    ```
1) If you want to use your schematics with Angular projects, you need to have the project name and path. You can pass the project name using the command line arguments and path is generated from the project name value. So we need to define `project` and `path` parameters in our schema definition file. 

2) Open the `schema.d.ts` file and add the following two members to the `Schema` interface.
    ```typescript
    path:string;
    project:string;
    ```
3) Also, you need to update the `schema.json` file for the new parameters. Add the following lines after the `findOne` parameter.
    ```json
    "path": {
        "type": "string",
        "format": "path",
        "description": "The path at which to create the service, relative to the workspace root.",
        "visible": false
    },
    "project": {
        "type": "string",
        "description": "The name of the project.",
        "$default": {
            "$source": "projectName"
        }
    }
    ```

4)  Open the `index.ts` file of the `http-resource` schematics. Add the following import statements to it.
    ```typescript
    import { Rule, SchematicContext, Tree, url, apply, template, mergeWith, chain, MergeStrategy, SchematicsException, move } from '@angular-devkit/schematics';
    import { strings } from '@angular-devkit/core';
    import { createDefaultPath, getWorkspace } from '@schematics/angular/utility/workspace';
    import { parseName } from '@schematics/angular/utility/parse-name';
    ```

5)  Update the index method with the following code:
    ```typescript
    export function httpResource(_options: Schema): Rule {
        return async (tree: Tree, _context: SchematicContext) => {
            const workspace = await getWorkspace(tree);
            if (!_options.project) {
                _options.project = workspace.projects.keys().next().value;
            }
            const project = workspace.projects.get(_options.project);
            if (!project) {
                throw new SchematicsException(`Invalid project name: ${_options.project}`);
            }
    
            if (_options.path === undefined) {
                _options.path = await createDefaultPath(tree, _options.project as string);
            }
    
            const parsedPath = parseName(_options.path, _options.name);
            _options.name = parsedPath.name;
            _options.path = parsedPath.path;
    
            const sourceTemplate = url("./files");
            const sourceParameterizedTemplate = apply(sourceTemplate, [
                template({
                    ..._options,
                    ...strings
                }),
                move(parsedPath.path)
            ]);
    
            return chain([mergeWith(sourceParameterizedTemplate, MergeStrategy.Overwrite)]);
      };
    }
    ```
    We are converting the anonymous function that is returned by `httpResource` method is converted into async because we are calling some awaitable methods inside the function.
    ```typescript
    const workspace = await getWorkspace(tree);
    ```
    The above line returns the current Angular project workspace reference object. An Angular project workspace can contain multiple projects.
    ```typescript
    if (!_options.project) {
        _options.project = workspace.projects.keys().next().value;
    }
    const project = workspace.projects.get(_options.project);
    if (!project) {
        throw new SchematicsException(`Invalid project name: ${_options.project}`);
    }
    ```
    The above piece of code checks for the project name in the command line parameters. The command line parameters are accessible using `_options` variable. If project name is not explicitly passed through the command line parameters then it takes the default project name from the angular project workspace. Using the project name it generate the project reference from the projects collection of the workspace object. If project reference is undefined then it throws an error and terminate the schematics execution.

    ```typescript
    if (_options.path === undefined) {
        _options.path = await createDefaultPath(tree, _options.project as string);
    }

    const parsedPath = parseName(_options.path, _options.name);
    _options.name = parsedPath.name;
    _options.path = parsedPath.path;
    ```
    The above code checks for the project path value in the options parameters. If not found it uses the `createDefaultPath` method to generate the path from the current project name. Then it parse the project path and name and store it to `_options` parameters set. 

    ```typescript
    const sourceTemplate = url("./files");
    const sourceParameterizedTemplate = apply(sourceTemplate, [
      template({
        ..._options,
        ...strings
      }),
      move(parsedPath.path)
    ]);

    return chain([mergeWith(sourceParameterizedTemplate, MergeStrategy.Overwrite)]);
    ```
    The above lines of code uses the templates files in `files` directory to generate the Angular service and model class.  The `chain` method asynchronously compile and build the files and move them to the specified path. `MergeStrategy.Overwrite` ensures that if file is already present then it will be overwritten by the new files.

6) Build the project. 
7) There are different ways to test the schematics with the Angular project.
    * **Method 1:** 
    Open the command terminal in the angular project folder and run the following command. We assume that the schematics project and angular workspace are in same directory.
        ```bash
        schematics ../sample-schematics/src/collection.json:http-resource services/employee --dry-run false
        ```
    * **Method 2:** 
    Use the `npm link` command to link your angular project and schematics project.  It is very easy to test schematics without rebuilding and installing to the angular project. As the first step open the `package.json` file of the schematics project and update the name parameter value to `@sample/schematics`. Rebuild your schematics project and run the following command from angular project folder.
        ```bash
        npm link ../sample-schematics
        ```
        This will install `@sample/schematics` package to angular project. You can verify it in `node_modules` folder.
        Then  run the following command to create the http service using schematics.
        ```bash
        ng generate @sample/schematics services/employee --url http://somedomain.com/api/employees --findOne
        ```
    * **Method 3:**
    You can package the schematics project using the `npm pack` command and install it to the Angular project using the `npm install` command. For that, open the `package.json` file of the schematics project and update the `name`, `version` and `description` if necessary. Also, open the `.npmignore` file and comment the following lines.
        ```json
        *.ts
        !*.d.ts
        ```
        Then open command terminal in the schematics project path and build the project using 
        ```bash
        npm run build
        ```
        Then package the project using the following command.
        ```bash
        npm pack
        ```
        This will generate the `.tgz` file. You can install this `tgz` file using the `npm install` command in Angular project. For that open the terminal in Angular project path and run the following command.
        ```bash
        npm install <path-to-tgz-file>
        ```
        You can see the npm package is installed in `node_modules` folder and updated in the dependencies list of `package.json`. Run the following command to generate the service using schematics.
        ```bash
        ng generate @sample/schematics:http-resource services/employee --url http://somedomain.com/api/employees --find-one
        ```
    * **Method 4:**
    You can also publish the package to `https://npmjs.com` site (npm repository) and install it to the Angular project from anywhere. For that you need to update the `package.json` file of the schematics project and provide a unique name for it. Also you can update the version number and description. Add `private:false` attribute to `package.json`. Then login to your npm account using the following command:
        ```bash
        npm login
        ``` 
        If you don't have the npm account you can create a new one using `npm adduser` command. After creating a new account you need to verify the account using the link received in the registered e-mail. 

        Then build the schematics project by running the following command
        ```bash
        npm run build
        ```
        Then publish it to the npm repository using:
        ```bash
        npm publish
        ```
        > [!IMPORTANT]
        > Ensure the name in the package.json is unique. Otherwise you may receive an `ACCESS DENIED` error while publishing it.

        Now, You can install the package to Angular project using the `npm install` command.
        ```bash
        npm install --save @sample/schematics
        ```
        Later you can use the `ng generate` command to create the service using schematics.
        ```bash
        ng generate @sample/schematics:http-resource services/employee --url http://somedomain.com/api/employees --find-one
        ```

## Adding `ng add` support to `http-resource` schematics
You can use the `ng add` schematics to generate the servcie class and model interface which we have defined using the `http-resource` schematics. Ng Add is a common practice of generating/updating files in Angular projects. You can achieve this by adding a new schematics `ng-add` to your `sample-schematics` project.
```bash
schematics blank ng-add
```
Open the `collections.json` and update the schematics definition for `ng-add`. Add the schema property and set the *schema.json* file of the `http-resource` schematics  as its value. 
```json
"ng-add": {
    "description": "Ng Add Schematics for http-resource",
    "factory": "./ng-add/index#ngAdd",
    "schema": "./http-resource/schema.json"
}
```
Open the `index.ts` file of the `ng-add` schematics and update  the import statement.
```typescript
import { chain, Rule, schematic, SchematicContext, Tree } from '@angular-devkit/schematics';
```
Update the `ngAdd` method definition with the following code. It will execute the `http-resource` schematic when you run the `ng-add` schematic.
```typescript
export function ngAdd(_options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        return chain([schematic('http-resource', _options)])(tree, _context);
    };
}
```
Build the project using the following command.
```bash
npm run build
```
Publish the package using `npm pack` and install it to Angular project. Alternatively, you can publish the package to npm repository using `npm publish` command. Then open the terminal in Angular project and run the following command to generate a service class for *product* using `ng add` command.
```bash
ng add @sample/schematics services/employee --url http://somedomain.com/api/employees --find-one
```

You can see the service class and the model interface are created in the project folder. 

### Happy Coding!!!!

[https://github.com/sonusathyadas/angular-schematics/blob/0e118948fae7ca795c137875af91e3f07c2da088/sample-schematics/package.json ](https://github.com/sonusathyadas/angular-schematics/blob/dcdc9f5f0217a99d8c03beb2033d0268eea42e13/sample-schematics/src/ng-add/index.ts#L1)
