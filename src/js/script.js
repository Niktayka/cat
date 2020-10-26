"use strict";

const selectedMsg = {
    fuagra: 'Печень утки разварная с артишоками.',
    fish: 'Головы щучьи с чесноком да свежайшая сёмгушка.',
    chicken: 'Филе из цыплят с трюфелями в бульоне.'
}

function init() {    
    let packs = getPacks();

    setHandlers(packs);
}

function getPacks() {
    const elems = document.getElementsByClassName('kote-food');
    return [].slice.call(elems);
}

function getStatus(elems) {

    let status = [];

    elems.forEach(function (val) {

        let isSelected = val.children[0].className.indexOf('_selected') != -1;
        let isDisabled = val.children[0].className.indexOf('_disabled') != -1;

        if (isSelected) {
            status.push('selected');
        } else if (isDisabled) {
            status.push('disabled');
        } else {
            status.push('default');
        }
    });

    return status;
}

function setHandlers(elems) {
    
    let containerW = document.getElementsByClassName('container')[0].clientWidth;
    return containerW > 1180
        ? addClickHandlers(elems)
        : addTouchHandlers(elems);
}

function addClickHandlers(elems) {

    let currStatus = getStatus(elems);
    
    elems.forEach(function (val, idx) {
        let isDisabled = currStatus[idx] === 'disabled';
        let isDefault = currStatus[idx] === 'default';

        if (!isDisabled) {
            let packCont = val.children[0];

            addHoverEvent(packCont);

            packCont.addEventListener('click', function(evt) {
                handler(evt, elems);
            });
            
            if (isDefault) {
                let linkBtn = document.getElementsByClassName('kote-food__msg-btn')[0];
                linkBtn.addEventListener('click', function(evt) {
                    handler(evt, elems);
                });
            }
        }
    });
}

function handler(evt, elems) {
    evt.stopPropagation();
    let currStatus = getStatus(elems);

    changeDesign(evt, elems, currStatus);
}

function changeStatus(currStat, pos) {
    switch (currStat[pos]) {
        case 'default': currStat[pos] = 'selected'; break;
        case 'selected': currStat[pos] = 'default'; break;
    }
    return currStat;
}

function changeDesign(initEvt, elems, status) {
    let target = initEvt.currentTarget;
    let contW = document.getElementsByClassName('container')[0].clientWidth;
    let isBtn = target.className.indexOf('-btn') != -1;

    elems.some(function(val, idx) {
        let targetCont = isBtn
            ? target.parentElement.previousElementSibling
            : target;
        let targetDataId = targetCont.parentElement.getAttribute('data-id');
        let currElemDataId = val.getAttribute('data-id');
        let isSelected = targetCont.className.indexOf('_selected') != -1;

        if (targetDataId === currElemDataId) {
            let nextStatus = changeStatus(status, idx);

            if (isSelected) {
                targetCont.className = 'kote-food__pack';
                targetCont.nextElementSibling.innerHTML = 'Чего сидишь? Порадуй котэ, <span class="kote-food__msg-btn"><b>купи.</b></span>';
                
                let linkBtn = targetCont.nextElementSibling.children[0];

                if (contW > 1180) {
                    linkBtn.addEventListener('click', function(evt) {
                        handler(evt, elems, nextStatus);
                    });
                } else {
                    linkBtn.addEventListener('touchend', function(evt) {
                        handler(evt, elems, nextStatus);
                    });
                }

            } else {
                targetCont.className = 'kote-food__pack_' + nextStatus[idx];

                let filler = targetCont.children[2].textContent;
                switch (filler) {
                    case 'с фуа-гра': targetCont.nextElementSibling.innerHTML = selectedMsg.fuagra; break;
                    case 'с рыбой': targetCont.nextElementSibling.innerHTML = selectedMsg.fish; break;
                    case 'с курой': targetCont.nextElementSibling.innerHTML = selectedMsg.chicken; break;
                }
            }

            if (contW > 1180) {
                removeHoverEvent(targetCont, isSelected);
                addHoverEvent(targetCont, initEvt);
            }
            return true;
        }
    });
}

function removeHoverEvent(clickTarget, selected) {
    clickTarget.removeEventListener('mouseenter', mouseIn);
    clickTarget.removeEventListener('mouseleave', mouseOut);

    clickTarget.parentElement.className = 'kote-food';

    if (selected) clickTarget.children[0].textContent = 'Сказочное заморское яство';
}

function addHoverEvent(clickTarget, clickEvt) {
    if (clickEvt) {
        var isBtn = clickEvt.currentTarget.className.indexOf('-btn') != -1;
    }
    
    if (isBtn || !clickEvt) {
        let isHover = clickTarget.parentElement.className.indexOf('hover') != -1;
        if (!isHover) clickTarget.parentElement.className += ' hover';

        clickTarget.addEventListener('mouseenter', mouseIn);
        clickTarget.addEventListener('mouseleave', mouseOut);

    } else {
        clickTarget.addEventListener('mouseleave', function() {
            let isHover = this.parentElement.className.indexOf('hover') != -1;
            if (!isHover) this.parentElement.className += ' hover';
    
            this.addEventListener('mouseenter', mouseIn);
            this.addEventListener('mouseleave', mouseOut);
            
        }, {once: true});
    }
}

function mouseIn() {
    let isSelected = this.className.indexOf('_selected') != -1;
    let header = this.children[0];
    if (isSelected) {
        header.textContent = 'Котэ не одобряет?';
    }
}

function mouseOut() {
    let isSelected = this.className.indexOf('_selected') != -1;
    let header = this.children[0];
    if (isSelected) {
        header.textContent = 'Сказочное заморское яство';
    }
}

function addTouchHandlers(elems) {
    let currStatus = getStatus(elems);
    
    elems.forEach(function (val, idx) {
        let isDisabled = currStatus[idx] === 'disabled';
        let isDefault = currStatus[idx] === 'default';

        if (!isDisabled) {
            let packCont = val.children[0];

            // addHoverEvent(packCont);

            packCont.addEventListener('touchend', function(evt) {
                handler(evt, elems);
            });
            
            if (isDefault) {
                let linkBtn = document.getElementsByClassName('kote-food__msg-btn')[0];
                linkBtn.addEventListener('touchend', function(evt) {
                    handler(evt, elems);
                });
            }
        }
    });
}
window.onload = init;