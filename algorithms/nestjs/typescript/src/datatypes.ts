let sale: number = 122_323_23;
let course: string = "TypeScript";
let is_published: boolean = true;
let level: any; // level is of any type in TypeScript (should avoid using any type)

//Arrays
let numbers: number[] = [1, 2, 3, 4, 5];

//Tuples - fixed length array
let user: [number, string] = [1, "John"];

//Enums - enumerations
enum Size { Small = 1, Medium, Large };
let mySize: Size = Size.Medium;

//Functions
function calculateTax(income: number, taxYear: number = 2023): number {
  if (taxYear < 2023) {
    return income * 1.2;
  }
  return income * 1.3;
}
let tax = calculateTax(10000, 2022);    // 12000
let tax2 = calculateTax(10000);         // 13000    

//Objects
let employee: { readonly id: number, name: string } = { id: 1, name: "John" };  
employee.name = "Jane"; // valid
// employee.id = 2; // invalid, id is readonly      

// Type Assertion
let phone = <HTMLInputElement>document.getElementById("phone");
phone.value = "123-456-7890";
let phone2 = document.getElementById("phone") as HTMLInputElement;
phone2.value = "123-456-7890";

// Define Type Alias - custom type (its not a class. it can't have methods)
type Employee = { id: number, name: string };
let employee2: Employee = { id: 1, name: "John" };
let employee3: Employee = { id: 2, name: "Jane" };




