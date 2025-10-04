// Global type declarations

// Allow importing CSS files
declare module '*.css' {
  const content: string;
  export default content;
}

// Allow importing CSS module files  
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Allow importing SCSS files
declare module '*.scss' {
  const content: string;
  export default content;
}

// Allow importing SCSS module files
declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
