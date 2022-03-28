//deleting image
// const fileToBeDeletedPath = eval(`existingProject.${formFieldName}`);
// const fileToBeDeletedPath = eval(
//   `existingProject.images[0]["imageSourceFull"]`
// );

//adding " into path of object to extract proper value
const testString = "existingProject.images[0][imageSourceFull]";
const foundAreaToBeChanged = testString.match(/(\[[A-Za-z0-9]+\]$)/)[0];
const unchangeablePathOfPath = testString.replace(foundAreaToBeChanged, "");
const result = `${unchangeablePathOfPath}${foundAreaToBeChanged.substring(
  0,
  1
)}"${foundAreaToBeChanged.substring(1, foundAreaToBeChanged.length - 1)}"]`;

console.log({ foundAreaToBeChanged });
console.log({ unchangablePathOfPath: unchangeablePathOfPath });
console.log({ result });
