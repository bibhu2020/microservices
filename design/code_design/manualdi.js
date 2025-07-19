//Manual Dependency Injection
// What is Dependency Injection?
// Dependency Injection is a design pattern that allows a class to receive its dependencies from an external source rather than creating them itself.
// This promotes loose coupling and makes the code more testable and maintainable.
// In this example, we will create a simple application that uses Dependency Injection to manage its dependencies.
// We will create a simple application that uses Dependency Injection to manage its dependencies.   

class Service {
    getData() {
        return 'real data';
    }
}

class Controller {
    constructor(service) {
        this.service = service;
    }

    handleRequest() {
        return this.service.getData();
    }
}
  
const myService = new Service(); //create the depedent object that is needed by the controller class
const controller = new Controller(myService); // injected dependency manually

console.log(controller.handleRequest());

//Note: Frameworks like Angular, React, and Vue provide built-in support for Dependency Injection, making it easier to manage dependencies in larger applications. However, understanding the core principles of Dependency Injection is essential for effective software design and architecture.
// In this example, we have a Service class that provides some data and a Controller class that depends on the Service class.   