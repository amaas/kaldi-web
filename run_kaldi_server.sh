#!/bin/bash

. path.sh

# Assumes correct files are in $mdl/ directory. Files needed there include
# final.mdl, HCLG.fst, words.txt, silence.csl, word_boundary.int, final.mat
# Email awni@stanford.edu for location of these files.

mdl=fisher_tri6a

online-audio-server-decode-faster --verbose=1 --rt-min=0.5 --rt-max=3.0 \
    --max-active=6000 --beam=72.0 --acoustic-scale=0.769 $mdl/final.mdl \
    $mdl/HCLG.fst $mdl/words.txt `cat $mdl/silence.csl`  \
    $mdl/word_boundary.int 5010 $mdl/final.mat
