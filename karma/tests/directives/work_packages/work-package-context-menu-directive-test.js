//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2014 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
//++

/*jshint expr: true*/

describe('workPackageContextMenu Directive', function() {
  var compile, element, rootScope, scope;

  beforeEach(angular.mock.module('openproject.workPackages.directives'));
  beforeEach(module('templates'));

  beforeEach(inject(function($rootScope, $compile, _ContextMenuService_) {
    var html;
    html = '<work-package-context-menu></work-package-context-menu>';

    element = angular.element(html);
    rootScope = $rootScope;
    scope = $rootScope.$new();
    ContextMenuService = _ContextMenuService_;

    compile = function() {
      $compile(element)(scope);
      scope.$digest();
    };
  }));

  describe('element', function() {
    beforeEach(function() {
      compile();
    });

    it('should render a surrounding div', function() {
      expect(element.prop('tagName')).to.equal('DIV');
    });

  });

  describe('when the context menu context contains one work package', function() {
    var I18n;
    var actions = ['edit', 'move'],
        actionLinks = {
          edit: '/work_packages/123/edit',
          move: '/work_packages/move/new?ids%5B%5D=123',
        },
        workPackage = Factory.build('PlanningElement', {
          _actions: actions,
          _links: actionLinks
        });
    var directListElements;

    beforeEach(function() {
      ContextMenuService.setContext({rows: [], row: {object: workPackage}});
      compile();

      directListElements = element.find('.menu > li:not(.folder)');
    });

    beforeEach(inject(function(_I18n_) {
      I18n = _I18n_;
      sinon.stub(I18n, 't').withArgs('js.button_' + actions[0]).returns('anything');
    }));
    afterEach(inject(function() {
      I18n.t.restore();
    }));

    it('lists link tags for any permitted action', function(){
      expect(directListElements.length).to.equal(2);
    });

    it('assigns a css class named by the action', function(){
      expect(directListElements[0].className).to.equal(actions[0]);
    });

    it('adds an icon from the icon fonts to each list element', function() {
      expect(element.find('.' + actions[0] +' a').attr('class')).to.include('icon-' + actions[0]);
    });

    xit('translates the action name', function() {
      expect(element.find('.' + actions[0] +' a').contents()).to.equal('anything');
      // TODO find out how to stub I18n.t inside directive
    });
  });
});
