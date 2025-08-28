from pyteal import *

def voting_app():
    # scratch var untuk indexing loop
    i = ScratchVar(TealType.uint64)

    # -------------------------
    # ON CREATE: terima kandidat lewat application_args
    # -------------------------
    on_creation = Seq(
        [
            # minimal 1 kandidat
            Assert(Txn.application_args.length() > Int(0)),

            # loop: untuk setiap arg, set global key = 0
            For(
                i.store(Int(0)),
                i.load() < Txn.application_args.length(),
                i.store(i.load() + Int(1))
            ).Do(
                App.globalPut(Txn.application_args[i.load()], Int(0))
            ),

            Approve(),
        ]
    )

    # -------------------------
    # ON CALL (Vote)
    # -------------------------
    candidate_choice = Txn.application_args[0]

    # ambil global key existence
    candidate_state = App.globalGetEx(Global.current_application_id(), candidate_choice)

    on_vote = Seq(
        [
            # pastikan argumen 1
            Assert(Txn.application_args.length() == Int(1)),

            # load the key check
            candidate_state,

            # pastikan kandidat ada (hasValue)
            Assert(candidate_state.hasValue()),

            # increment
            App.globalPut(candidate_choice, candidate_state.value() + Int(1)),

            Approve(),
        ]
    )

    # -------------------------
    # ON DELETE (only creator)
    # -------------------------
    on_delete = Seq(
        [
            Assert(Txn.sender() == Global.creator_address()),
            Approve(),
        ]
    )

    # main program
    program = Cond(
        [Txn.application_id() == Int(0), on_creation],
        [Txn.on_completion() == OnComplete.NoOp, on_vote],
        [Txn.on_completion() == OnComplete.DeleteApplication, on_delete],
        [Int(1), Reject()],
    )

    return program


if __name__ == "__main__":
    # compile to approval.teal
    with open("approval.teal", "w") as f:
        teal_code = compileTeal(voting_app(), mode=Mode.Application, version=6)
        f.write(teal_code)
    print("Compiled approval.teal ✅")
