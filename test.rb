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

$tests = ['count', 'edit', 'history', 'storage']

$fmks = Hash.new
$fmks['angularjs'] = 'architecture-examples/angularjs/index.html'
$fmks['angularjs-perf'] = 'architecture-examples/angularjs-perf/index.html'
$fmks['backbone'] = 'architecture-examples/backbone/index.html'
$fmks['dart'] = 'architecture-examples/dart/web/index.html'
$fmks['emberjs'] = 'architecture-examples/emberjs/index.html'
$fmks['jquery'] = 'architecture-examples/jquery/index.html'
$fmks['knockoutjs'] = 'architecture-examples/knockoutjs/index.html'
$fmks['spine'] = 'architecture-examples/spine/index.html'
$fmks['vanillajs'] = 'vanilla-examples/vanillajs/index.html'

# TODO be able to use lists of items (aka './test.rb dart jquery count edit')
ARGV.each do |arg|
  if $tests.include?(arg)
    $test = arg
  end
  if $fmks.keys.include?(arg)
    $fmk = arg
  end
end

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

if $test.nil?
  $tests.each do |test|
    printf '%-10s| ' % test
  end
else
  printf '%-10s| ' % $test
end

print "\n"

$setCasper = "if [ -z ${casperjs} ]; then export casperjs=casperjs; fi"

def casper(fmk, test)
  # TODO option to enable casperjs output instead of table
  #print "#{$setCasper};$casperjs tests/#{test}.js #{$fmks[fmk]} > /dev/null"
  #print "\n"
  system("#{$setCasper};$casperjs tests/#{test}.js #{$fmks[fmk]} > tests/results/#{fmk}.#{test}") ? printok : printko
end

system("mkdir -p tests/results")

def doTests(fmk)
  printf '%14s | ' % fmk
  if $test.nil?
    $tests.each do |test|
      casper(fmk, test)
    end
  else
    casper(fmk, $test)
  end
  print "\n"
end

if $fmk.nil?
  $fmks.keys.each do |fmk|
    doTests(fmk)
  end
else
  doTests($fmk)
end
