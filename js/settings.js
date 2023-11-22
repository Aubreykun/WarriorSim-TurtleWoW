var SIM = SIM || {}

SIM.SETTINGS = {

    init: function () {
        var view = this;
        view.variables();
        view.events();
        view.buildSpells();
        view.buildBuffs();
        view.buildTalents();
        view.buildRunes();
    },

    variables: function () {
        var view = this;
        view.body = $('body');
        view.buffs = view.body.find('article.buffs');
        view.fight = view.body.find('article.fight');
        view.rotation = view.body.find('article.rotation');
        view.talents = view.body.find('article.talents');
        view.filter = view.body.find('article.filter');
        view.close = view.body.find('section.settings .btn-close');
        view.bg = view.body.find('section.sidebar .bg');
    },

    events: function () {
        var view = this;

        view.close.click(function (e) {
            e.preventDefault();
            $('.js-settings').removeClass('active');
            $('section.settings').removeClass('active');
            view.body.addClass('sidebar-mobile-open');
        });
        view.buffs.on('click', '.icon', function (e) {
            let obj = $(this).toggleClass('active');
            if (obj.hasClass('active')) {
                if (obj.data('group'))
                    obj.siblings().filter('[data-group="' + obj.data('group') + '"]').removeClass('active');
                if (obj.data('disable-spell'))
                    $('.rotation [data-id="' + obj.data('disable-spell') + '"]').removeClass('active');
            }
            for (let buff of buffs) {
                buff.active = view.buffs.find('[data-id="' + buff.id + '"]').hasClass('active');
            }
            e.stopPropagation();
            e.preventDefault();
            SIM.UI.updateSession();
            SIM.UI.updateSidebar();
        });

        view.talents.on('click', '.icon', function (e) {
            let talent = view.getTalent($(this));
            let total = view.getTalentTotal($(this));
            // if (total < talent.y * 5) return;

            let storage = JSON.parse(localStorage[mode + (globalThis.profileid || 0)]);
            let level = parseInt(storage.level);
            let count = 0;
            for (let tree of talents)
                for (let talent of tree.t)
                    count += talent.c;
            let available = Math.max(level - 9 - count, 0);
            // if (available <= 0) return; Disabled this restriction so we can theorycraft different talent combos to recommend class changes

            talent.c = talent.c < talent.m ? talent.c + 1 : talent.m;
            $(this).attr('data-count', talent.c);
            if (talent.c >= talent.m) $(this).addClass('maxed');
            if (talent.enable)
                $('.rotation [data-id="' + talent.enable + '"]').removeClass('hidden');
            $(this).find('a').attr('href', 'https://database.turtle-wow.org/?spell=' + talent.s[talent.c == 0 ? 0 : talent.c - 1]);
            SIM.UI.updateSession();
            SIM.UI.updateSidebar();
            view.buildSpells();
        });

        view.talents.on('contextmenu', '.icon', function (e) {
            e.preventDefault();
            let talent = view.getTalent($(this));
            talent.c = talent.c < 1 ? 0 : talent.c - 1;
            $(this).attr('data-count', talent.c);
            $(this).removeClass('maxed');
            if (talent.c == 0 && talent.enable) {
                $('.rotation [data-id="' + talent.enable + '"]').removeClass('active').addClass('hidden');
                for (let spell of spells)
                    if (spell.id == talent.enable)
                        spell.active = false;
            }
            $(this).find('a').attr('href', 'https://database.turtle-wow.org/?spell=' + talent.s[talent.c == 0 ? 0 : talent.c - 1]);
            SIM.UI.updateSession();
            SIM.UI.updateSidebar();
        });

        view.talents.on('click', '.js-talents-reset', function (e) {
            e.preventDefault();
            for (let tree of talents)
                for (let talent of tree.t)
                    talent.c = 0;
            SIM.UI.updateSession();
            SIM.UI.updateSidebar();
            view.buildTalents();
            view.buildSpells();
        });

        view.filter.on('click', '.sources > li', function (e) {
            $(this).toggleClass('active');
            /*  // commenting this allows users to select raids as a source, while also deslecting blizzlike gear, to easily see just what is custom to the server
            if ($(this).hasClass('active')) {
                let id = $(this).data('id');
                view.filter.find(`.phases [data-sources*="${id}"]`).addClass('active');
            }
            */
            SIM.UI.updateSession();
            SIM.UI.filterGear();
            e.preventDefault();
        });

        view.filter.on('click', '.js-toggle, li ul', function(e) {
            e.stopPropagation();
            if (this.classList.contains("js-toggle")) {
                var toggleEle = this.getAttribute('data-id');
                $("."+toggleEle).toggleClass('hidden');
            }
        });

        view.filter.on('click', '.phases li', function (e) {
            $(this).toggleClass('active');
            let sources = $(this).data('sources').split(',');
            let show = $(this).hasClass('active');
            for (let source of sources) {
                if (show) view.filter.find('.sources [data-id="' + source + '"]').addClass('active');
                else view.filter.find('.sources [data-id="' + source + '"]').removeClass('active');
            }
            SIM.UI.updateSession();
            SIM.UI.filterGear();
        });

        view.buffs.on('click', 'label', function(e) {
            var view = this;
            $(view.parentElement).find('div').toggleClass('hidden');
            SIM.SETTINGS.toggleArticle(view);
        });

        view.fight.on('click', 'label', function (e) {
            var view = this;
            $(view.parentElement).find('ul').toggleClass('hidden');
            SIM.SETTINGS.toggleArticle(view);
        });

        view.talents.on('click', 'label', function (e) {
            var view = this;
            $(view.parentElement).find('table').toggleClass('hidden');
            SIM.SETTINGS.toggleArticle(view);
        });
        view.filter.on('click', 'label', function (e) {
            var view = this;
            $(view.parentElement).find('ul').toggleClass('hidden');
            SIM.SETTINGS.toggleArticle(view);
        });

        view.fight.on('input', '.slider', function (e) {
            var val = $(this).val();
            $(this).next().val(val);
            $(this).next().trigger("keyup");
        });

        view.fight.on('change', 'select[name="race"]', function (e) {
            var val = $(this).val();
            view.bg.attr('data-race', val);

            e.stopPropagation();
            SIM.UI.updateSession();
            SIM.UI.updateSidebar();
            view.buildSpells();
        });

        view.fight.on('change', 'select[name="aqbooks"]', function (e) {
            e.stopPropagation();
            SIM.UI.updateSession();
            SIM.UI.updateSidebar();
            view.buildSpells();
            view.buildBuffs();
        });

        view.fight.on('keyup', 'input[type="text"]', function (e) {
            e.stopPropagation();
            if (!view.body.find('.active[data-type="profiles"]').length)
                SIM.UI.filterGear();
            SIM.UI.updateSession();
            SIM.UI.updateSidebar();
            view.buildBuffs();
            view.buildSpells();
        });

        view.fight.on('change', 'select[name="batching"]', function (e) {
            e.stopPropagation();
            SIM.UI.updateSession();
            SIM.UI.updateSidebar();
        });

        view.rotation.on('click', '.spell a', function (e) {
            e.stopPropagation();
            e.preventDefault();
            let el = $(this).closest('.spell');
            let id = el.data('id');
            el.toggleClass('open');
            el.removeClass('fade');
            let isopen = el.hasClass("open");
            if (isopen) {
                el.siblings().addClass('fade');
                el.siblings('.open').each(function() {
                    $(this).removeClass('open');
                    view.hideSpellDetails($(this));
                });
            }
            else {
                el.siblings().removeClass('fade');
            }

            for (let spell of spells) {
                if (spell.id == id) {
                    if (isopen) view.buildSpellDetails(spell, el);
                    else view.hideSpellDetails(el);
                }
            }
        });

        view.rotation.on('click', '.details li:not(.nobox)', function (e) {
            if (e.target.nodeName !== "LI") return;
            $(this).toggleClass('active');
            let active = $(this).hasClass('active');
            let id = $(this).parents('.details').data('id');
            let spell;
            for (let s of spells) if (s.id == id) spell = s;

            if ($(this).data('id') == 'active') {
                view.rotation.find(`.spell[data-id="${id}"]`).toggleClass('active', active);

                if (active && spell.name == "Heroic Strike") {
                    for (let s of spells) 
                        if (s.name == "Cleave" && s.active) {
                            s.active = false;
                            view.rotation.find(`.spell[data-id="${s.id}"]`).removeClass('active');
                        }
                }
                if (active && spell.name == "Cleave") {
                    for (let s of spells) 
                        if (s.name == "Heroic Strike" && s.active) {
                            s.active = false;
                            view.rotation.find(`.spell[data-id="${s.id}"]`).removeClass('active');
                        }
                }
            }

            if (active && $(this).data('group')) {
                $(this).siblings(`.active[data-group="${$(this).data('group')}"]`).click();
            }

            spell[$(this).data('id')] = active;
            SIM.UI.updateSession();
        });

        view.rotation.on('keyup', '.details input', function (e) {
            let id = $(this).parents('.details').data('id');

            for (let spell of spells)
                if (spell.id == id)
                    spell[$(this).attr('name')] = $(this).val();

            SIM.UI.updateSession();
        });

    },

    buildSpells: function () {
        const view = this;
        let storage = JSON.parse(localStorage[mode + (globalThis.profileid || 0)]);
        let level = parseInt(storage.level);
        let container = view.rotation.find('div:first');
        container.empty();
        if (view.rotation.find('.open')) view.hideSpellDetails(view.rotation.find('.open'))

        let buffs = '';
        for (let spell of spells) {

            // race restriction
            if (spell.id == 26296 && storage.race !== "Troll") {
                spell.active = false;
                continue;
            }
            if (spell.id == 20572 && storage.race !== "Orc") {
                spell.active = false;
                continue;
            }

            // level restriction
            let min = parseInt(spell.minlevel || 0);
            let max = parseInt(spell.maxlevel || 60);
            if (level < min || level > max) {
                spell.active = false;
                continue;
            }

            // talent restriction
            let talent;
            for (let tree of talents)
                for (let t of tree.t)
                    if (t.n == spell.name) talent = t;
            if (talent && talent.enable && talent.c == 0) {
                spell.active = false;
                continue;
            }

            // rune restrictions
            let rune;
            if (typeof runes !== 'undefined') {
                for (let type in runes)
                    for (let r of runes[type])
                        if (r.enable == spell.id) rune = r;
                if (rune && !rune.selected) {
                    spell.active = false;
                    continue;
                }
            }
            else if (spell.rune) {
                spell.active = false;
                continue;
            }

            // aoe restriction
            if (storage.adjacent == 0 && spell.name == "Cleave") {
                spell.active = false;
                continue;
            }

            // aq restriction
            if (storage.aqbooks == "Yes" && typeof spell.aq !== 'undefined' && spell.aq === false) {
                spell.active = false;
                continue;
            }
            if (storage.aqbooks == "No" && spell.aq) {
                spell.active = false;
                continue;
            }


            let div = $(`<div data-id="${spell.id}" class="spell ${spell.active ? 'active' : ''}"><div class="icon">
            <img src="dist/img/${spell.iconname.toLowerCase()}.jpg " alt="${spell.name}">
            <a href="https://classic.wowhead.com/spell=${spell.id}" class="wh-tooltip"></a>
            </div></div>`);

            if (spell.buff) buffs += div[0].outerHTML;
            else container.append(div);

        }

        container.append($('<div class="label">Buffs</div>'));
        container.append(buffs);


    },

    buildSpellDetails(spell, el) {
        const view = this;
        let details = view.rotation.find('.details');
        details.data('id',spell.id);
        details.empty();
        details.append(`<label>${spell.name}</label>`);
        let ul = $("<ul></ul>");
        
        if (spell.haste !== undefined)
            ul.append(`<li class="nobox ${spell.haste ? 'active' : ''}">Attack speed set at <input type="text" name="haste" value="${spell.haste}" data-numberonly="true" /> %</li>`);

        if (typeof spell.timetoend === 'undefined')
            ul.append(`<li data-id="active" class="${spell.active ? 'active' : ''}">Enabled</li>`);
        if (typeof spell.minrage !== 'undefined' && spell.id != 11597) 
            ul.append(`<li data-id="minrageactive" class="${spell.minrageactive ? 'active' : ''}">${spell.name == "Heroic Strike" ? 'Queue' : 'Use'} when above <input type="text" name="minrage" value="${spell.minrage}" data-numberonly="true" /> rage</li>`);
        if (typeof spell.minrage !== 'undefined' && spell.id == 11597) 
            ul.append(`<li data-id="minrageactive" class="${spell.minrageactive ? 'active' : ''}" data-group="usage">Only use when above <input type="text" name="minrage" value="${spell.minrage}" data-numberonly="true" /> rage</li>`);
        if (typeof spell.maxrage !== 'undefined') 
            ul.append(`<li data-id="maxrageactive" class="${spell.maxrageactive ? 'active' : ''}">Don't use when above <input type="text" name="maxrage" value="${spell.maxrage}" data-numberonly="true" /> rage</li>`);
        if (typeof spell.maincd !== 'undefined') 
            ul.append(`<li data-id="maincdactive" class="${spell.maincdactive ? 'active' : ''}">Don't ${spell.name == "Heroic Strike" ? 'queue' : 'use'} if BT / MS cooldown shorter than <input type="text" name="maincd" value="${spell.maincd}" data-numberonly="true" /> seconds</li>`);
        if (typeof spell.duration !== 'undefined') 
            ul.append(`<li data-id="durationactive" class="${spell.durationactive ? 'active' : ''}" data-group="usage">Only use every <input type="text" name="duration" value="${spell.duration}" data-numberonly="true" /> seconds</li>`);
        if (typeof spell.unqueue !== 'undefined') 
            ul.append(`<li data-id="unqueueactive" class="${spell.unqueueactive ? 'active' : ''}">Unqueue if below <input type="text" name="unqueue" value="${spell.unqueue}" data-numberonly="true" /> rage before MH swing</li>`);
        if (typeof spell.exmacro !== 'undefined') 
            ul.append(`<li data-id="exmacro" class="${spell.exmacro ? 'active' : ''}" data-group="ex">Always queue when casting Execute</li>`);
        if (spell.timetoend !== undefined)
            ul.append(`<li data-id="active" class="${spell.active ? 'active' : ''}">Use on last <input type="text" name="timetoend" value="${spell.timetoend}" data-numberonly="true" /> seconds of the fight</li>`);
        if (spell.priorityap !== undefined)
            ul.append(`<li data-id="priorityapactive" class="${spell.priorityapactive ? 'active' : ''}">Don't use if Attack Power is higher than <input type="text" name="priorityap" value="${spell.priorityap}" data-numberonly="true" style="width: 25px" /></li>`);
        if (spell.procblock !== undefined)
            ul.append(`<li data-id="procblock" class="${spell.procblock ? 'active' : ''}">Don't use rage until it procs</li>`);
        if (spell.rageblock !== undefined)
            ul.append(`<li data-id="rageblockactive" class="${spell.rageblockactive ? 'active' : ''}">Don't use rage below <input type="text" name="rageblock" value="${spell.rageblock}" data-numberonly="true" /> rage</li>`);
        if (spell.flagellation !== undefined)
            ul.append(`<li data-id="flagellation" class="${spell.flagellation ? 'active' : ''}">Don't use when ${spell.id == 18499 ? "Bloodrage" : "Berserker Rage"} is up</li>`);
        if (spell.consumedrage !== undefined)
            ul.append(`<li data-id="consumedrage" class="${spell.consumedrage ? 'active' : ''}">Use only when Consumed by Rage procs</li>`);
        if (spell.execute !== undefined)
            ul.append(`<li data-id="execute" class="${spell.execute ? 'active' : ''}">Use during Execute phase</li>`);
        if (typeof spell.globals !== 'undefined') 
            ul.append(`<li data-id="globalsactive" class="${spell.globalsactive ? 'active' : ''}" data-group="usage">Only use on first <input type="text" name="globals" value="${spell.globals}" data-numberonly="true" /> globals</li>`);
        if (spell.chargeblock !== undefined)
            ul.append(`<li data-id="chargeblockactive" class="${spell.chargeblockactive ? 'active' : ''}">Don't use rage below <input type="text" name="chargeblock" value="${spell.chargeblock}" data-numberonly="true" /> CbR charges</li>`);
        if (spell.erageblock !== undefined)
            ul.append(`<div class="label">Execute Phase:</div><li data-id="erageblockactive" class="${spell.erageblockactive ? 'active' : ''}">Don't use rage below <input type="text" name="erageblock" value="${spell.erageblock}" data-numberonly="true" /> rage</li>`);
        if (spell.echargeblock !== undefined)
            ul.append(`<li data-id="echargeblockactive" class="${spell.echargeblockactive ? 'active' : ''}">Don't use rage below <input type="text" name="echargeblock" value="${spell.echargeblock}" data-numberonly="true" /> CbR charges</li>`);
        

        
        // if (spell.crusaders !== undefined)
        //     ul.append(`<li data-id="active" class="${spell.crusaders ? 'active' : ''}">Use when <input type="text" name="timetoend" value="${spell.timetoend}" data-numberonly="true" /> seconds of the fight</li>`);



        details.css('visibility','hidden');
        details.append(ul);
        let height = details.height();
        
        setTimeout(function() {
            details.css('visibility','');
            el.css('margin-bottom', height + 30 + 'px');
            details.css('top', el.position().top + 74 + 'px');
            details.addClass('visible');
        }, 200);
        
        
    },

    hideSpellDetails(el) {
        const view = this;
        let details = view.rotation.find('.details');
        details.removeClass('visible');
        el.css('margin-bottom', '0px');
        
    },

    toggleArticle: function(label) {
        if (label.classList.contains("active")) {
            label.classList.add("inactive")
            label.classList.remove("active")
        } else {
            label.classList.add("active")
            label.classList.remove("inactive")
        }
    },

    buildBuffs: function () {
        var view = this;
        view.buffs.empty();
        view.buffs.append('<label class="active">Buffs</label>');
        let storage = JSON.parse(localStorage[mode + (globalThis.profileid || 0)]);
        let level = parseInt(storage.level);
        let worldbuffs = '', consumes = '', other = '';
        for (let buff of buffs) {

            // level restrictions
            let min = parseInt(buff.minlevel || 0);
            let max = parseInt(buff.maxlevel || 60);
            if (level < min || level > max) {
                buff.active = false;
                continue;
            }

            // aq restrictions
            if (storage.aqbooks == "Yes" && typeof buff.aq !== 'undefined' && buff.aq === false) {
                buff.active = false;
                continue;
            }
            if (storage.aqbooks == "No" && buff.aq) {
                buff.active = false;
                continue;
            }

            // sod restrictions
            if (mode !== "sod" && buff.sod) {
                buff.active = false;
                continue;
            }

            let wh = buff.spellid ? 'spell' : 'item';
            let active = buff.active ? 'active' : '';
            let group = buff.group ? `data-group="${buff.group}"` : '';
            let disable = buff.disableSpell ? `data-disable-spell="${buff.disableSpell}"` : '';
            let html = `<div data-id="${buff.id}" class="icon ${active}" ${group} ${disable}>
                            <img src="dist/img/${buff.iconname.toLowerCase()}.jpg " alt="${buff.name}">
                            <a href="https://database.turtle-wow.org/?${wh}=${buff.id}" class="wh-tooltip"></a>
                        </div>`;
            if (buff.worldbuff) worldbuffs += html;
            else if (buff.consume) consumes += html;
            else if (buff.other) other += html;
            else view.buffs.append(html);
        }
        view.buffs.append('<div class="label">Consumables</div>');
        view.buffs.append(consumes);
        view.buffs.append('<div class="label">World Buffs</div>');
        view.buffs.append(worldbuffs);
        view.buffs.append('<div class="label">Other</div>');
        view.buffs.append(other);
        SIM.UI.updateSession();
        SIM.UI.updateSidebar();
    },

    buildTalents: function () {
        var view = this;
        view.talents.find('table').remove();
        for (let tree of talents) {
            let table = $('<table><tr><th colspan="4">' + tree.n + '</th></tr></table>');
            for (let i = 0; i < 7; i++) table.prepend('<tr><td></td><td></td><td></td><td></td></tr>');
            for (let talent of tree.t) {
                let div = $('<div class="icon" data-count="' + talent.c + '" data-x="' + talent.x + '" data-y="' + talent.y + '"></div>');
                div.html('<img src="dist/img/' + talent.iconname.toLowerCase() + '.jpg" alt="' + talent.n + '" />');
                if (talent.c >= talent.m) div.addClass('maxed');
                div.append('<a href="https://database.turtle-wow.org/?spell=' + talent.s[talent.c == 0 ? 0 : talent.c - 1] + '" class="wh-tooltip"></a>');
                table.find('tr').eq(talent.y).children().eq(talent.x).append(div);
            }
            view.talents.append(table);
        }
    },

    buildRunes: function () {
        var view = this;
        if (typeof runes === "undefined") return;
        for (let type in runes) {
            for (let i in runes[type]) {
                let rune = runes[type][i];
                if (rune.enable && rune.selected) view.rotation.find('[data-id="' + rune.enable + '"]').removeClass('hidden');
                if (rune.enable && !rune.selected) view.rotation.find('[data-id="' + rune.enable + '"]').addClass('hidden');
            }
        }
    },

    getTalent: function (div) {
        let tree = div.parents('table').index() - 1;
        let x = div.data('x');
        let y = div.data('y');
        for (let talent of talents[tree - 1].t)
            if (talent.x == x && talent.y == y)
                return talent;
    },

    getTalentTotal: function (div) {
        let tree = div.parents('table').index() - 1;
        let count = 0;
        for (let talent of talents[tree - 1].t)
            count += parseInt(talent.c);
        return count;
    }

};
