const PROJDIV = document.getElementById('projDiv');
const MAINLINKSLIST = document.getElementById('mainLinksList');

fetch('projdata.json')
.then((res) => {return res.json()})
.then((PROJDATA) => {
    console.log(PROJDATA);

    for (i = 1; i <= Object.keys(PROJDATA).length; i++) {
        let navbarMainItem = document.createElement('li');
        navbarMainItem.classList.add('nav-item');
        navbarMainItem.classList.add('mr-sm-2');

        let currCategory = PROJDATA[i]['name'];
        
        // add the necessary h1s to the body of the webpage
        let projCategoryHeader = document.createElement('h1');
        projCategoryHeader.classList.add('mb-4');
        let projCategoryHeaderAnchor = document.createElement('a');
        projCategoryHeaderAnchor.classList.add('anchor');
        projCategoryHeaderAnchor.id = `p${i}`;
        projCategoryHeader.appendChild(projCategoryHeaderAnchor);
        projCategoryHeader.appendChild(document.createTextNode(`${currCategory} projects`));
        PROJDIV.appendChild(projCategoryHeader);

        let sublinksObj = PROJDATA[i]['sublinks'];
        if (sublinksObj) {
            let numSublinks = Object.keys(sublinksObj).length;
            // make the navbar item a dropdown item
            navbarMainItem.classList.add('dropdown');
            // initialize the <a> that toggles the dropdown
            let navbarDropdownToggle = document.createElement('a');
            navbarDropdownToggle.classList.add('nav-link');
            navbarDropdownToggle.classList.add('dropdown-toggle');
            navbarDropdownToggle.id = `navbarDropdownMenuLink${i}`;
            navbarDropdownToggle.setAttribute('role', 'button');
            navbarDropdownToggle.setAttribute('data-toggle', 'dropdown');
            navbarDropdownToggle.setAttribute('aria-haspopup', 'true');
            navbarDropdownToggle.setAttribute('aria-expanded', 'false');
            navbarDropdownToggle.appendChild(document.createTextNode(currCategory));
            navbarMainItem.appendChild(navbarDropdownToggle);
            // now we make the div that holds the actual dropdown items
            let dropdownMenuDiv = document.createElement('div');
            dropdownMenuDiv.classList.add('dropdown-menu');
            dropdownMenuDiv.setAttribute('aria-labelledby', `navbarDropdownMenuLink${i}`);
            for (j = 1; j <= numSublinks; j++) {
                let currSubcategory = PROJDATA[i]['sublinks'][j]['name'];
 
                // create the links inside the dropdown
                let dropdownMenuLink = document.createElement('a');
                dropdownMenuLink.classList.add('dropdown-item');
                dropdownMenuLink.href = `#p${i}.${j}`;
                dropdownMenuLink.appendChild(document.createTextNode(currSubcategory));
                dropdownMenuDiv.appendChild(dropdownMenuLink);
                 
                // make the h3 for the subheading
                let projSubcategoryHeader = document.createElement('h3');
                projSubcategoryHeader.classList.add('mb-2');
                let projSubcategoryHeaderAnchor = document.createElement('a');
                projSubcategoryHeaderAnchor.classList.add('anchor');
                projSubcategoryHeaderAnchor.id = `p${i}.${j}`;
                projSubcategoryHeader.appendChild(projSubcategoryHeaderAnchor);
                projSubcategoryHeader.appendChild(document.createTextNode(currSubcategory));
                PROJDIV.appendChild(projSubcategoryHeader);
 
                generateProjectCards(PROJDATA[i]['sublinks'][j]['subprojs'], i, j);
            }
            navbarMainItem.appendChild(dropdownMenuDiv);
        } else {
            let navbarMainLink = document.createElement('a');
            navbarMainLink.classList.add('nav-link');
            navbarMainLink.classList.add('nav-link');
            navbarMainLink.classList.add('nav-link');
            navbarMainLink.href = PROJDATA[i]['href'];
            navbarMainLink.appendChild(document.createTextNode(currCategory));
            navbarMainItem.appendChild(navbarMainLink);

            generateProjectCards(PROJDATA[i]['subprojs'], i);
        }
        MAINLINKSLIST.appendChild(navbarMainItem);
    }
});

function generateProjectCards(projObjRef, i, j=null) {
    let numProjs = Object.keys(projObjRef).length;
    let numProjsProcessed = 0;
    let currRow;
    while (numProjsProcessed < numProjs) {
        if (numProjsProcessed % 3 == 0) {
            currRow = document.createElement('div');
            currRow.classList.add('row');
            PROJDIV.appendChild(currRow);
        }
        let currProj = projObjRef[numProjsProcessed+1];
        let currProjLink = projObjRef[numProjsProcessed+1]['link'];
        let currProjFilePath = (currProjLink) ? currProjLink : (j) ? `p/${i}/${j}/${numProjsProcessed+1}` : `p/${i}/${numProjsProcessed+1}`;
        let currProjName = currProj['name'];
        let currProjTimestamp = currProj['timestamp'];
        let currProjDesc = currProj['description'];
        let currProjTagArr = currProj['tags'];
        let currProjTagStr = '';
        for (t = 0; t < currProjTagArr.length; t++) {
            currProjTagStr += `<span class="badge ${(currProjTagArr[t] == 'WIP' ? 'badge-danger' : 'badge-primary')} ${(t < currProjTagArr.length - 1) ? 'mr-2' : ''}">${currProjTagArr[t]}</span>`;
        }

        let cardWrapperDiv = document.createElement('div');
        cardWrapperDiv.classList.add('col-md');
        cardWrapperDiv.classList.add('d-flex');
        cardWrapperDiv.classList.add('align-items-stretch');
        cardWrapperDiv.classList.add('mt-2');

        let cardHTML = 
        `
        <div class="card shadow-sm mb-4">
            <div class="card-body" onclick="${currProjTimestamp == "future" ? '' : `location.href='${currProjFilePath}`}'">
                <h5 class="card-title">${currProjName}</h5>
                <h6 class="card-subtitle mb-2 text-muted"><i class="far fa-calendar-alt"></i> ${currProjTimestamp}</h6>
                <p class="card-text">${currProjDesc}</p>
            </div>
            <div class="badge-holder d-flex justify-content-end align-self-end">
                ${currProjTagStr}
            </div>
        </div>
        `;
        
        cardWrapperDiv.innerHTML = cardHTML;
    
        currRow.appendChild(cardWrapperDiv);

        numProjsProcessed++;
    }

    if (numProjs == 0) {
        let noProjsDiv = document.createElement('div');
        noProjsDiv.classList.add('mx-auto');
        noProjsDiv.classList.add('mb-4');
        noProjsDiv.appendChild(document.createTextNode('No projects at the moment'));
        PROJDIV.appendChild(noProjsDiv);
    }
}