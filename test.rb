#!/usr/bin/env ruby

# TODO check ko due to false dir is obvious
# TODO for use './test.rb fmk scenario' (scenario optional)

#agilityjs  angularjs-perf  canjs   dart    emberjs   jquery    knockoutjs  yui
#angularjs  backbone  closure   dojo    gwt   knockback spine

#casperjs tests/test.js vanilla-examples/vanillajs/index.html

#backbone.xmpp      dijon       meteor        sammyjs
#backbone_marionette    duel        montage       socketstream
#batman       epitome       o_O       somajs
#cujo       extjs       olives        stapes
#dart       javascriptmvc     plastronjs      thorax
#derby        knockoutjs_classBindingProvider puremvc       troopjs
#dermis       maria       rappidjs

tests = ['count', 'edit', 'history', 'storage']

fmks = Hash.new
fmks['angularjs'] = 'architecture-examples/angularjs/index.html'
=begin
fmks['angularjs-perf'] = 'architecture-examples/angularjs-perf/index.html'
fmks['backbone'] = 'architecture-examples/backbone/index.html'
fmks['dart'] = 'architecture-examples/dart/web/index.html'
fmks['emberjs'] = 'architecture-examples/emberjs/index.html'
fmks['jquery'] = 'architecture-examples/jquery/index.html'
fmks['knockoutjs'] = 'architecture-examples/knockoutjs/index.html'
fmks['spine'] = 'architecture-examples/spine/index.html'
fmks['vanillajs'] = 'vanilla-examples/vanillajs/index.html'
=end

def printok()
  print "\033[32m"
  printf '%-10s' % 'OK'
  print "\033[0m| "
end

def printko()
  print "\033[31m"
  printf '%-10s' % 'KO'
  print "\033[0m| "
end

printf '%-15s| ' % ' '

tests.each do |test|
  printf '%-10s| ' % test
end

print "\n"

setCasper = "if [ -z ${casperjs} ]; then export casperjs=casperjs; fi"

fmks.keys.each do |key|
  printf '%14s | ' % key
  tests.each do |test|
    system("#{setCasper};$casperjs tests/#{test}.js #{fmks[key]}") ? printok : printko
  end
  print "\n"
end
